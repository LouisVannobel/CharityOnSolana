import { FC } from 'react';

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'medium'
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#1e293b] bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white text-lg">{message}</p>
        </div>
      </div>
    );
  }

  // Determine spinner size based on prop
  const spinnerSize = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-4" data-testid="loading-indicator">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-purple-500`}></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
