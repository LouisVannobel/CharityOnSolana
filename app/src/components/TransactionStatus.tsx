import { FC } from 'react';
import LoadingIndicator from './LoadingIndicator';

export type TransactionState = 'none' | 'processing' | 'success' | 'error';

interface TransactionStatusProps {
  state: TransactionState;
  message?: string;
  txSignature?: string;
  onClose?: () => void;
}

const TransactionStatus: FC<TransactionStatusProps> = ({
  state,
  message,
  txSignature,
  onClose
}) => {
  if (state === 'none') return null;

  const getStatusContent = () => {
    switch (state) {
      case 'processing':
        return (
          <div className="flex flex-col items-center">
            <LoadingIndicator size="medium" />
            <p className="mt-4 text-gray-700">{message || 'Processing transaction...'}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Transaction Successful!</p>
            <p className="text-gray-600 mb-4">{message || 'Your transaction has been confirmed.'}</p>
            {txSignature && (
              <a
                href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                View on Solscan Explorer
              </a>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Transaction Failed</p>
            <p className="text-gray-600 mb-4">{message || 'There was an error processing your transaction.'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {getStatusContent()}
        
        {(state === 'success' || state === 'error') && onClose && (
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-transparent rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatus;
