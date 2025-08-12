'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${getBgColor()} max-w-sm`}>
        {getIcon()}
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {message}
        </span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'warning', duration?: number) => void;
}

export const useToast = (): ToastContextType => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { message, type, duration, id, onClose: () => removeToast(id) };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { showToast };
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { message, type, duration, id, onClose: () => removeToast(id) };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose showToast globally
  useEffect(() => {
    (window as unknown as { showToast?: (message: string, type: 'success' | 'error' | 'warning', duration?: number) => void }).showToast = showToast;
    return () => {
      delete (window as unknown as { showToast?: (message: string, type: 'success' | 'error' | 'warning', duration?: number) => void }).showToast;
    };
  }, [showToast]);

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
        />
      ))}
    </>
  );
}; 