import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";
import { useNotificationStore } from "../stores/notificationStore";

const typeConfig = {
  success: {
    bg: "bg-lightGreen/90",
    border: "border-brown",
    text: "text-darkBrown",
    icon: FiCheckCircle,
  },
  error: {
    bg: "bg-darkRed/90",
    border: "border-brown",
    text: "text-white",
    icon: FiAlertTriangle,
  },
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-900",
    icon: FiInfo,
  },
} as const;

const ToastItem = ({
  id,
  type,
  message,
}: {
  id: string;
  type: keyof typeof typeConfig;
  message: string;
}) => {
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => removeNotification(id), 3000);
    return () => window.clearTimeout(timer);
  }, [id, removeNotification]);

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`w-full rounded-3xl border ${config.border} ${config.bg} shadow-lg shadow-black/5 overflow-hidden pointer-events-auto`}
    >
      <div className="flex items-center gap-3 p-8 relative">
        <div className={`rounded-2xl p-2 ${config.bg} ${config.text}`}>
          <Icon size={20} />
        </div>
        <div className={`flex-1 leading-6 ${config.text}`}>{message}</div>
        <button
          type="button"
          onClick={() => removeNotification(id)}
          className={`transition cursor-pointer absolute top-4 right-6 ${config.text}`}
          aria-label="Close notification"
        >
          <FiX size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export function NotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications);

  return createPortal(
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-3 px-4 pointer-events-none w-fit max-w-[500px] mx-auto">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
