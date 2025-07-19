import GoogleDriveFiles from "@/components/GoogleDriveFiles";
import DriveDebug from "@/components/DriveDebug";
import GoogleDriveAuth from "@/components/GoogleDriveAuth";
import OAuth2Debug from "@/components/OAuth2Debug";
import { DriveProvider } from "@/contexts/DriveContext";
import { useDrive } from "@/contexts/DriveContext";

const DrivePageContent = () => {
  const { isAuthenticated } = useDrive();
  
  const handleAuthSuccess = () => {
    // This will trigger a re-render and the context will update
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Google Drive Files</h1>
        <OAuth2Debug />
        <div className="flex items-center justify-center min-h-[40vh]">
          <GoogleDriveAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Google Drive Files</h1>
      <DriveDebug />
      <GoogleDriveFiles />
    </div>
  );
};

const DrivePage = () => {
  return (
    <DriveProvider>
      <DrivePageContent />
    </DriveProvider>
  );
};

export default DrivePage;
