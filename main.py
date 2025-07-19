from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredExcelLoader
)
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain

# ---- SETUP ----
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Google API key not found in .env file.")

# ---- LOAD DOCUMENTS ----
def load_document(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return PyPDFLoader(file_path).load()
    elif ext == ".txt":
        return TextLoader(file_path).load()
    elif ext in [".xls", ".xlsx"]:
        return UnstructuredExcelLoader(file_path).load()
    else:
        print(f"Unsupported file type: {file_path}. Skipping...")
        return []

def load_documents_from_folder(folder_path):
    all_docs = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isdir(file_path):
            continue
        try:
            docs = load_document(file_path)
            print(f"Loaded {len(docs)} from {filename}")
            all_docs.extend(docs)
        except Exception as e:
            print(f"Error loading {filename}: {e}")
    return all_docs

# ---- INIT ----
docs_folder = "/Users/pulkitpandey/Desktop/Ai-Agent/docubuddy-answer-central/docs"
documents = load_documents_from_folder(docs_folder)
if not documents:
    raise ValueError("No valid documents loaded.")

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(documents)
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
vectorstore = FAISS.from_documents(chunks, embedding)
llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-pro", google_api_key=GOOGLE_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")

# ---- FASTAPI SERVER ----
app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # use specific origin for security in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
async def chat(msg: Message):
    try:
        relevant_docs = vectorstore.similarity_search(msg.message)
        answer = chain.run(input_documents=relevant_docs, question=msg.message)
        return {"reply": answer}
    except Exception as e:
        return {"reply": f"❌ Error: {str(e)}"}

