// src/components/NotificationPanel.tsx

import React, { useEffect, useRef } from "react";

// 1. Define a type for a single notification
type Notification = {
  type: "added" | "removed" | "updated";
  file: string;
  time: string;
};

// 2. Set up props typing
interface NotificationPanelProps {
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notifications]);

  return (
    <aside className="bg-card/80 border-r w-72 h-full p-3 flex flex-col gap-2 shadow-inner overflow-y-auto">
      <div className="text-lg font-bold mb-2">🔔 Notifications</div>
      {notifications.length === 0 && (
        <div className="text-muted-foreground text-sm px-3 py-2">No notifications yet.</div>
      )}
      {notifications.map((n, i) => (
        <div key={i}
          className={`rounded px-3 py-2 shadow-sm bg-white/95 dark:bg-background/80 text-sm border-l-4
            ${n.type === "added"
              ? "border-green-500"
              : n.type === "removed"
                ? "border-red-500"
                : "border-yellow-400"}`}>
          <div>
            <span className="font-semibold">{n.file}</span>
            {n.type === "added" && <span className="ml-2 text-green-600">was added</span>}
            {n.type === "removed" && <span className="ml-2 text-red-600">was removed</span>}
            {n.type === "updated" && <span className="ml-2 text-yellow-500">was updated</span>}
          </div>
          <div className="text-xs text-muted-foreground">{n.time}</div>
        </div>
      ))}
      <div ref={endRef} />
    </aside>
  );
};

export default NotificationPanel;
export type { Notification };
