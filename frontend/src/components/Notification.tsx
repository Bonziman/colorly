// src/components/Notification.tsx
import React, { useEffect } from 'react';
import './styles/Notification.css';

interface NotificationProps {
  message: string;
  duration: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration); // Close after the given duration

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [message, duration, onClose]);

  return (
    <div className="notification">
      <p>{message}</p>
    </div>
  );
};

export default Notification;
