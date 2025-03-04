import { FC, useState, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Notification: FC<NotificationProps> = ({
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColorClass = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  const iconClass = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 ${bgColorClass} text-white p-4 rounded-lg shadow-lg max-w-md z-50 flex items-start`}>
      <div className="flex-shrink-0 mr-3">
        <i className={iconClass}></i>
      </div>
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
