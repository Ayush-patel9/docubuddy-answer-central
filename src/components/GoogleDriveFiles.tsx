"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Search,
  ExternalLink,
  FolderOpen,
  Home
} from "lucide-react";
import { useDrive } from "@/contexts/DriveContext";
import { formatFileSize } from "@/lib/googleDriveService";

import "./GoogleDriveFiles.css";

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("image/"))
    return <Image className="icon-file image" />;
  if (mimeType.includes("video/"))
    return <Video className="icon-file video" />;
  if (mimeType.includes("audio/"))
    return <Music className="icon-file audio" />;
  if (mimeType.includes("zip") || mimeType.includes("rar"))
    return <Archive className="icon-file archive" />;
  if (mimeType.includes("text/") || mimeType.includes("document"))
    return <FileText className="icon-file text" />;
  return <File className="icon-file generic" />;
};

const getFileTypeColor = (mimeType: string) => {
  if (mimeType.includes("image/")) return "badge image";
  if (mimeType.includes("video/")) return "badge video";
  if (mimeType.includes("audio/")) return "badge audio";
  if (mimeType.includes("application/pdf")) return "badge pdf";
  if (mimeType.includes("text/") || mimeType.includes("document"))
    return "badge text";
  if (mimeType.includes("spreadsheet")) return "badge spreadsheet";
  return "badge generic";
};

export const GoogleDriveFiles: React.FC = () => {
  const { files, isLoading, error, refreshFiles, searchFiles } = useDrive();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const driveFolderLink =
    "https://drive.google.com/drive/folders/1zXkSacSoBdfbg0hm5ndXSkjyZO5tsqG6";

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const aT = new Date(a.modifiedTime).getTime();
      const bT = new Date(b.modifiedTime).getTime();
      return sortDirection === "asc" ? aT - bT : bT - aT;
    });
  }, [files, sortDirection]);

  const handleSearch = () => {
    searchQuery.trim() ? searchFiles(searchQuery) : refreshFiles();
  };

  const toggleSort = () =>
    setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
  const formatDate = (s: string) => new Date(s).toLocaleDateString();

  return (
    <div className="gdrive-bg">
      <div className="floating-geometry-system">
        <div className="floating-geometry triangle-1 animate-float-complex-1" />
        <div className="floating-geometry circle-1 animate-float-complex-2" />
        <div className="floating-geometry diamond-1 animate-float-complex-3" />
        <div className="floating-geometry hexagon-1 animate-float-complex-4" />
      </div>
      <div className="grid-pattern animate-grid-pulse" />
      <Card className="gdrive-card professional-card floating-professional-card animate-fade-in-smooth">
        <CardHeader className="gdrive-sticky-header">
          <CardTitle>
            <div className="gdrive-title-bar">
              <span className="gdrive-title-left">
                <Home
                  className="gdrive-btn-home"
                  role="button"
                  tabIndex={0}
                />
                <span>Google Drive Files</span>
                <Badge className="gdrive-badge-count">
                  {files.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(driveFolderLink, "_blank")}
                  title="Open Google Drive Folder"
                  className="gdrive-btn-folder"
                >
                  <FolderOpen />
                </Button>
              </span>
              <span className="gdrive-title-right">
                <Button
                  onClick={toggleSort}
                  variant="outline"
                  size="sm"
                  className="professional-button-outline"
                >
                  {sortDirection === "asc" ? "↑ Date" : "↓ Date"}
                </Button>
                <Button
                  onClick={refreshFiles}
                  variant="outline"
                  size="sm"
                  className="professional-button-outline"
                >
                  Refresh
                </Button>
              </span>
            </div>
            <div className="gdrive-search-bar">
              <Input
                placeholder="Search files…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="professional-input"
              />
              <Button
                onClick={handleSearch}
                size="sm"
                className="professional-button"
              >
                <Search />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="gdrive-content professional-scrollbar">
          {isLoading ? (
            <div className="gdrive-loading">
              <div className="gdrive-spinner" />
              Loading Google Drive files...
            </div>
          ) : error ? (
            <div className="gdrive-error">
              <p>Error: {error}</p>
              <Button onClick={refreshFiles} className="professional-button">
                Try Again
              </Button>
            </div>
          ) : sortedFiles.length === 0 ? (
            <div className="gdrive-empty">
              <FileText className="gdrive-icon-large" />
              No files found
            </div>
          ) : (
            <div className="gdrive-file-list">
              {sortedFiles.map((file) => (
                <div className="gdrive-file-item magnetic" key={file.id}>
                  <div className="gdrive-info">
                    {getFileIcon(file.mimeType)}
                    <div className="gdrive-text-group">
                      <span className="gdrive-filename professional-text-dark">
                        {file.name}
                      </span>
                      <div className="gdrive-meta">
                        <Badge className={getFileTypeColor(file.mimeType)}>
                          {file.mimeType.split("/").pop()?.toUpperCase()}
                        </Badge>
                        {file.size && (
                          <span className="gdrive-meta-size">
                            {formatFileSize(file.size)}
                          </span>
                        )}
                        <span className="gdrive-meta-modified">
                          Modified: {formatDate(file.modifiedTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {file.webViewLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(file.webViewLink, "_blank")
                      }
                      className="professional-button-outline"
                    >
                      <ExternalLink className="mr-1" /> Open
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleDriveFiles;
