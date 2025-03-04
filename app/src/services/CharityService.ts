import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// This will be replaced with actual program ID from our deployed contract
const CHARITY_PROGRAM_ID = '11111111111111111111111111111111';
// Charity wallet address - this would be your actual charity wallet
const CHARITY_WALLET_ADDRESS = 'YOUR_CHARITY_WALLET_ADDRESS';

// Token mint address for reward tokens
const TOKEN_MINT_ADDRESS = 'YOUR_TOKEN_MINT_ADDRESS';

export interface NFTTier {
  id: number;
  name: string;
  price: number; // in SOL
  available: number;
  total: number;
  imageUrl: string;
  description: string;
}

// Mock NFT tiers based on our contract implementation
export const NFT_TIERS: NFTTier[] = [
  {
    id: 1,
    name: 'Tier 1 - Supporter',
    price: 1,
    available: 20,
    total: 20,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    description: 'Support our cause with a basic donation and receive a unique NFT.',
  },
  {
    id: 2,
    name: 'Tier 2 - Advocate',
    price: 2,
    available: 15,
    total: 15,
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
    description: 'Become an advocate for our cause with a medium donation.',
  },
  {
    id: 3,
    name: 'Tier 3 - Champion',
    price: 3.5,
    available: 10,
    total: 10,
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1586&q=80',
    description: 'Champion our cause with a significant donation and receive a premium NFT.',
  },
  {
    id: 4,
    name: 'Tier 4 - Hero',
    price: 5,
    available: 5,
    total: 5,
    imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    description: 'Become a hero for our cause with a major donation and receive our most exclusive NFT.',
  },
];

export class CharityService {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection) {
    this.connection = connection;
    this.programId = new PublicKey(CHARITY_PROGRAM_ID);
  }

  /**
   * Get all NFT tiers available for purchase
   */
  public async getNFTTiers(): Promise<NFTTier[]> {
    // In a real implementation, this would fetch data from the smart contract
    // For now, we'll return the mock data
    return NFT_TIERS;
  }

  /**
   * Purchase an NFT from a specific tier
   * @param wallet The user's wallet
   * @param tierId The tier ID of the NFT to purchase
   */
  public async purchaseNFT(wallet: WalletContextState, tierId: number): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    const tier = NFT_TIERS.find(t => t.id === tierId);
    if (!tier) {
      throw new Error('Invalid tier ID');
    }

    try {
      // Check if the user has enough SOL for the purchase
      const balance = await this.connection.getBalance(wallet.publicKey);
      const price = tier.price * LAMPORTS_PER_SOL;
      
      if (balance < price) {
        throw new Error(`Insufficient funds. You need at least ${tier.price} SOL to purchase this NFT.`);
      }
      
      // In a real implementation, we would call our smart contract
      // For now, we'll simulate it with a SOL transfer and program call
      
      const charityWallet = new PublicKey(CHARITY_WALLET_ADDRESS);
      const programId = new PublicKey(CHARITY_PROGRAM_ID);
      
      // Create transaction instructions
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: charityWallet,
        lamports: price,
      });
      
      // This would be replaced with an actual call to our program
      // to mint the NFT and reward tokens
      const purchaseData = Buffer.from(
        Uint8Array.of(0, ...new Uint8Array(new Uint32Array([tierId]).buffer))
      );
      
      const purchaseInstruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: charityWallet, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(TOKEN_MINT_ADDRESS), isSigner: false, isWritable: true },
        ],
        programId,
        data: purchaseData,
      });
      
      // Create and configure transaction
      const transaction = new Transaction();
      transaction.add(transferInstruction);
      transaction.add(purchaseInstruction);
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      // Sign transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send transaction
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      // Update NFT availability (in a real app, this would be handled by the contract)
      this.updateNFTAvailability(tierId);
      
      return signature;
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }
  
  /**
   * Update NFT availability after purchase (mock implementation)
   * @param tierId The tier ID of the purchased NFT
   */
  private updateNFTAvailability(tierId: number): void {
    const tierIndex = NFT_TIERS.findIndex(t => t.id === tierId);
    if (tierIndex !== -1 && NFT_TIERS[tierIndex].available > 0) {
      NFT_TIERS[tierIndex].available -= 1;
    }
  }

  /**
   * Get the user's NFT collection
   * @param walletAddress The user's wallet address
   */
  public async getUserNFTs(walletAddress: string): Promise<any[]> {
    // This is a placeholder implementation
    // In a real app, you would fetch the user's NFTs from the blockchain
    
    // For demonstration purposes, we're returning mock data
    // Using simple SVG images from public folder
    
    return [
      {
        id: 'nft-001',
        name: 'Charity Panda #001',
        imageUrl: 'https://via.placeholder.com/300/3498db/FFFFFF?text=Panda+%23001',
        tier: 1,
        description: 'A rare panda NFT supporting wildlife conservation'
      },
      {
        id: 'nft-042',
        name: 'Charity Tiger #042',
        imageUrl: 'https://via.placeholder.com/300/e67e22/FFFFFF?text=Tiger+%23042',
        tier: 2,
        description: 'A unique tiger NFT supporting endangered species'
      }
    ];
  }

  /**
   * Get the user's token balance
   * @param walletAddress The user's wallet address
   */
  public async getTokenBalance(walletAddress: string): Promise<number> {
    // This is a placeholder implementation
    // In a real app, you would fetch the user's token balance from the blockchain
    
    // For demonstration purposes, we're just returning a random number
    return Math.floor(Math.random() * 100);
  }
}

export default CharityService;
