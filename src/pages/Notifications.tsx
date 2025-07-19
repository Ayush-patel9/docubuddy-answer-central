import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBar = ({ notifications, removeNotification }) => {
  return (
    <div className="notifications">
      <h3>📢 Latest Updates</h3>
      <AnimatePresence>
        {notifications.map((note, index) => (
          <motion.div
            className="notification-item"
            key={note}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span>{note}</span>
            <button
              className="dismiss-btn"
              onClick={() => removeNotification(index)}
            >
              ❌
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;
