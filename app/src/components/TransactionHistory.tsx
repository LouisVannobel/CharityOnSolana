import { FC, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import LoadingIndicator from './LoadingIndicator';

interface Transaction {
  signature: string;
  timestamp: number;
  status: 'confirmed' | 'failed';
  type: 'purchase' | 'reward';
  amount: number;
  blockTime?: number;
}

const TransactionHistory: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;
      
      try {
        setIsLoading(true);
        // Fetch recent transactions for the connected wallet
        const signatures = await connection.getSignaturesForAddress(
          publicKey,
          { limit: 10 }
        );

        // Get transaction details
        const txDetails = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getTransaction(sig.signature);
            return {
              signature: sig.signature,
              timestamp: sig.blockTime ? new Date(sig.blockTime * 1000).getTime() : Date.now(),
              status: sig.err ? 'failed' : 'confirmed',
              type: tx?.meta?.logMessages?.some(msg => msg.includes('NFT')) ? 'purchase' : 'reward',
              amount: tx?.meta?.postBalances[0] !== undefined && tx?.meta?.preBalances[0] !== undefined
                ? (tx.meta.preBalances[0] - tx.meta.postBalances[0]) / 1000000000 // Convert lamports to SOL
                : 0,
              blockTime: sig.blockTime
            };
          })
        );

        setTransactions(txDetails as Transaction[]);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [connection, publicKey]);

  if (!publicKey) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Please connect your wallet to view transaction history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction History</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingIndicator size="medium" />
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.signature}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'purchase' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {tx.type === 'purchase' ? 'NFT Purchase' : 'CHAR Reward'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.amount > 0 ? `${tx.amount.toFixed(4)} SOL` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Pending'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a 
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-900"
                    >
                      {`${tx.signature.slice(0, 8)}...${tx.signature.slice(-8)}`}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-4">No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
