import { NotionDocuments } from "@/components/NotionDocuments";
import { NotionProvider } from "@/contexts/NotionContext";

const NotionPage = () => {
  return (
    <NotionProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notion Files</h1>
        <NotionDocuments />
      </div>
    </NotionProvider>
  );
};

export default NotionPage;
