import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = ({ 
  size = 'medium', 
  text = 'Carregando...', 
  overlay = false, 
  color = 'yellow' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-lg';
      case 'large':
        return 'text-4xl';
      case 'xlarge':
        return 'text-6xl';
      default:
        return 'text-2xl';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'yellow':
        return 'text-yellow-500';
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'red':
        return 'text-red-500';
      case 'gray':
        return 'text-gray-500';
      default:
        return 'text-yellow-500';
    }
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner personalizado */}
      <div className="relative">
        <div className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`}>
          <FontAwesomeIcon icon={faSpinner} />
        </div>
        
        {/* Círculo de fundo */}
        <div className={`absolute inset-0 ${getSizeClasses()} text-gray-200 opacity-30`}>
          <FontAwesomeIcon icon={faSpinner} />
        </div>
      </div>
      
      {/* Texto de carregamento */}
      {text && (
        <div className="text-center">
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <LoadingContent />
    </div>
  );
};

// Componente de Loading inline para botões
export const ButtonLoading = ({ size = 'small' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-5 h-5';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${getSizeClasses()}`}></div>
  );
};

// Componente de Loading para skeleton
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          {index < lines - 1 && <div className="h-4 bg-gray-200 rounded w-3/4"></div>}
        </div>
      ))}
    </div>
  );
};

export default Loading;