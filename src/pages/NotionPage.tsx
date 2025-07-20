import { NotionDocuments } from "@/components/NotionDocuments";
import { NotionProvider } from "@/contexts/NotionContext";
import "./NotionPage.css";

const NotionPage = () => {
  return (
    <NotionProvider>
      <div className="notion-bg">
        {/* Animated geometry and grid */}
        <div className="notion-floating-geometry">
          <div className="notion-triangle animate-fl1" />
          <div className="notion-circle animate-fl2" />
          <div className="notion-diamond animate-fl3" />
          <div className="notion-hexagon animate-fl4" />
        </div>
        <div className="notion-grid" />
        {/* Card */}
        <div className="notion-main-container">
          <h1 className="notion-title">Notion Files</h1>
          <NotionDocuments />
        </div>
      </div>
    </NotionProvider>
  );
};

export default NotionPage;
