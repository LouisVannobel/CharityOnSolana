import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import LoadingIndicator from './LoadingIndicator';

// This will be replaced with actual token mint address from our deployed contract

interface TokenInfoProps {
  className?: string;
}

export const TokenInfo: FC<TokenInfoProps> = ({ className = '' }) => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!publicKey || !connected) {
        setTokenBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // This is a placeholder implementation
        // In a real app, you would use getTokenAccountsByOwner to find the token account
        // and then get the balance from that account
        
        // For demonstration purposes, we're just setting a random balance
        // This will be replaced with actual token balance fetching logic
        setTimeout(() => {
          const mockBalance = Math.floor(Math.random() * 100);
          setTokenBalance(mockBalance);
          setIsLoading(false);
        }, 1000);
        
        // The actual implementation would look something like this:
        /*
        const tokenAccounts = await connection.getTokenAccountsByOwner(
          publicKey,
          { mint: new PublicKey(CHARITY_TOKEN_MINT) }
        );
        
        if (tokenAccounts.value.length === 0) {
          setTokenBalance(0);
        } else {
          const accountInfo = await connection.getTokenAccountBalance(
            tokenAccounts.value[0].pubkey
          );
          setTokenBalance(Number(accountInfo.value.amount) / Math.pow(10, accountInfo.value.decimals));
        }
        */
      } catch (err) {
        console.error('Error fetching token balance:', err);
        setError('Failed to fetch token balance. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenBalance();
    // Set up an interval to refresh the balance periodically
    const intervalId = setInterval(fetchTokenBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [publicKey, connected, connection]);

  if (!connected || !publicKey) {
    return (
      <div className={`content-section ${className}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">CHAR Token Balance</h2>
        <p className="text-gray-600">
          Connect your wallet to view your token balance.
        </p>
      </div>
    );
  }

  return (
    <div className={`content-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">CHAR Token Balance</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Fetching token balance...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Your Token Balance</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              Updated just now
            </div>
          </div>
          
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-white text-3xl font-bold">CHAR</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-purple-600 text-lg">🪙</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              {tokenBalance !== null ? tokenBalance : '0'}
            </div>
            <p className="text-gray-500 text-sm mt-1">CHAR Tokens</p>
          </div>
          
          <div className="mt-6 bg-white/60 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">About CHAR Tokens</h4>
            <p className="text-sm text-gray-600">
              CHAR Tokens are earned by purchasing NFTs from our collection.
              You receive 10 tokens for each SOL donated.
            </p>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">Token Name:</span>
                <span className="ml-1 text-gray-700 font-medium">CHAR</span>
              </div>
              <div>
                <span className="text-gray-500">Symbol:</span>
                <span className="ml-1 text-gray-700 font-medium">CHAR</span>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">Decimals:</span>
                <span className="ml-1 text-gray-700 font-medium">9</span>
              </div>
              <div>
                <span className="text-gray-500">Network:</span>
                <span className="ml-1 text-gray-700 font-medium">Solana Devnet</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'nft-gallery' }))}
              className="btn-secondary inline-flex items-center"
            >
              Get More CHAR
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenInfo;
