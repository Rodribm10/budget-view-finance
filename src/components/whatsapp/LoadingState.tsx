
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Buscando instância..." }: LoadingStateProps) => {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="ml-3">{message}</p>
    </div>
  );
};

export default LoadingState;
