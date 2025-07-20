from __future__ import annotations
import os, re, tempfile, pathlib
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from tqdm import tqdm

# LangChain / Gemini
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredExcelLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain

# ------------- ENV / CONSTANTS -------------
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE")
DRIVE_FOLDER_LINK = os.getenv("DRIVE_FOLDER_LINK")

if not GOOGLE_API_KEY or not SERVICE_ACCOUNT_FILE or not DRIVE_FOLDER_LINK:
    raise ValueError("Missing GOOGLE_API_KEY, SERVICE_ACCOUNT_FILE or DRIVE_FOLDER_LINK in .env")

# ------------- GOOGLE DRIVE HELPERS -------------
FOLDER_ID_REGEX = re.compile(r"/folders/([a-zA-Z0-9_-]+)")

def extract_folder_id(link: str) -> str:
    if re.fullmatch(r"[a-zA-Z0-9_-]{10,}", link.strip()):
        return link.strip()
    m = FOLDER_ID_REGEX.search(link)
    if m:
        return m.group(1)
    raise ValueError("Could not parse folder ID from link")

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=creds, cache_discovery=False)

def list_files_in_folder(service, folder_id: str) -> List[dict]:
    query = f"'{folder_id}' in parents and trashed = false"
    files, page_token = [], None
    while True:
        resp = service.files().list(
            q=query,
            fields="nextPageToken, files(id, name, mimeType)",
            pageSize=1000,
            pageToken=page_token
        ).execute()
        files.extend(resp.get("files", []))
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return files

def download_file(service, file_id: str, destination: pathlib.Path) -> pathlib.Path:
    request = service.files().get_media(fileId=file_id)
    with destination.open("wb") as fh, tqdm(
        desc=f"↓ {destination.name}", unit="B", unit_scale=True, unit_divisor=1024
    ) as bar:
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            if status:
                bar.update(int(status.resumable_progress) - bar.n)
    return destination

# ------------- DOCUMENT LOADING -------------
def load_document(path: pathlib.Path):
    ext = path.suffix.lower()
    try:
        if ext == ".pdf":
            return PyPDFLoader(str(path)).load()
        elif ext == ".txt":
            # Try different encodings to handle Unicode issues
            try:
                return TextLoader(str(path), encoding='utf-8').load()
            except UnicodeDecodeError:
                try:
                    return TextLoader(str(path), encoding='latin-1').load()
                except Exception:
                    try:
                        return TextLoader(str(path), encoding='cp1252').load()
                    except Exception:
                        print(f"Failed to load {path.name} due to encoding issues – skipped")
                        return []
        elif ext in (".xls", ".xlsx"):
            return UnstructuredExcelLoader(str(path)).load()
        else:
            print(f"Unsupported {path.name} – skipped")
            return []
    except Exception as e:
        print(f"Error loading {path.name}: {str(e)} – skipped")
        return []

def build_vectorstore_from_drive(folder_link: str):
    svc = get_drive_service()
    folder_id = extract_folder_id(folder_link)
    files_meta = list_files_in_folder(svc, folder_id)

    if not files_meta:
        raise ValueError("Drive folder is empty or inaccessible")

    with tempfile.TemporaryDirectory() as tmpdir:
        all_docs = []
        for meta in files_meta:
            name, fid, mime = meta["name"], meta["id"], meta["mimeType"]
            if mime.startswith("application/vnd.google-apps"):
                print(f"Skipping native GDoc: {name}")
                continue
            local_path = pathlib.Path(tmpdir) / name
            download_file(svc, fid, local_path)
            all_docs.extend(load_document(local_path))

        if not all_docs:
            raise ValueError("No supported documents downloaded")

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(all_docs)

        embedder = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", google_api_key=GOOGLE_API_KEY
        )
        return FAISS.from_documents(chunks, embedder)

# ------------- INITIALISATION -------------
print("▶ Building FAISS index from Google Drive folder…")
vectorstore = build_vectorstore_from_drive(DRIVE_FOLDER_LINK)
print("✅ Vectorstore ready")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro", google_api_key=GOOGLE_API_KEY
)
chain = load_qa_chain(llm, chain_type="stuff")

# ------------- FASTAPI -------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
async def chat(msg: Message):
    try:
        docs = vectorstore.similarity_search(msg.message, k=5)
        answer = chain.run(input_documents=docs, question=msg.message)
        return {"reply": answer}
    except Exception as e:
        return {"reply": f"❌ Error: {e}"}
