
import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingState = ({ 
  message = "Buscando instância...", 
  size = 'medium',
  className = ''
}: LoadingStateProps) => {
  const spinnerSizes = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSizes[size]} border-b-2 border-primary`}></div>
      {message && <p className={`ml-3 ${textSizes[size]}`}>{message}</p>}
    </div>
  );
};

export default LoadingState;
