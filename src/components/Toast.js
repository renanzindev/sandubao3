import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const getToastStyles = () => {
    const baseStyles = 'flex items-center space-x-3 p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-xl" />;
      case 'warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-xl" />;
      case 'info':
        return <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-xl" />;
      default:
        return <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 text-xl" />;
    }
  };

  if (!isVisible || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full">
      <div 
        className={`${getToastStyles()} transform transition-all duration-300 ease-in-out ${
          isLeaving 
            ? 'translate-x-full opacity-0 scale-95' 
            : 'translate-x-0 opacity-100 scale-100'
        }`}
      >
        {getIcon()}
        
        <div className="flex-1">
          <p className="font-medium text-sm leading-relaxed">{message}</p>
        </div>
        
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
          aria-label="Fechar notificação"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Toast;