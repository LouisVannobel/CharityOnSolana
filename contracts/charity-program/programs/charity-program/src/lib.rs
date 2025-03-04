use anchor_lang::prelude::*;
use anchor_spl::{token::{self, Token, MintTo, Mint, TokenAccount}, associated_token::AssociatedToken};

declare_id!("7TTm7WWEFtesGC127KJS2vgrTd9dLijU8iBFqVVL1wYH");

#[error_code]
pub enum CharityError {
    #[msg("Insufficient funds for NFT purchase")]
    InsufficientFunds,
    #[msg("Invalid NFT price tier")]
    InvalidPriceTier,
    #[msg("Failed to transfer SOL")]
    TransferFailed,
    #[msg("Failed to mint reward tokens")]
    RewardMintFailed,
    #[msg("Invalid token parameters")]
    InvalidTokenParams,
    #[msg("Invalid collection size")]
    InvalidCollectionSize,
    #[msg("Invalid NFT metadata")]
    InvalidNftMetadata,
}

#[program]
pub mod charity_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        reward_decimals: u8,
        reward_rate: u64,
    ) -> Result<()> {
        let charity_data = &mut ctx.accounts.charity_data;
        charity_data.authority = ctx.accounts.authority.key();
        charity_data.reward_mint = ctx.accounts.reward_mint.key();
        charity_data.reward_decimals = reward_decimals;
        charity_data.reward_rate = reward_rate;
        Ok(())
    }

    pub fn purchase_nft(
        ctx: Context<PurchaseNft>,
        price_lamports: u64,
    ) -> Result<()> {
        let buyer = &ctx.accounts.buyer;
        require!(
            buyer.lamports() >= price_lamports,
            CharityError::InsufficientFunds
        );

        let valid_tiers = [
            1_000_000_000, // 1 SOL
            2_000_000_000, // 2 SOL
            3_500_000_000, // 3.5 SOL
            5_000_000_000, // 5 SOL
        ];
        require!(
            valid_tiers.contains(&price_lamports),
            CharityError::InvalidPriceTier
        );

        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &ctx.accounts.charity_wallet.key(),
            price_lamports,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                buyer.to_account_info(),
                ctx.accounts.charity_wallet.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let reward_amount = (price_lamports / 1_000_000_000) * 10 * (10u64.pow(9));

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.reward_mint.to_account_info(),
                    to: ctx.accounts.buyer_reward_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
            ),
            reward_amount,
        )?;

        Ok(())
    }

    pub fn initialize_token(
        ctx: Context<InitializeToken>,
        name: String,
        symbol: String,
        decimals: u8,
    ) -> Result<()> {
        require!(decimals <= 9, CharityError::InvalidTokenParams);
        require!(name.len() <= 32, CharityError::InvalidTokenParams);
        require!(symbol.len() <= 10, CharityError::InvalidTokenParams);

        let token_info = &mut ctx.accounts.token_info;
        token_info.name = name;
        token_info.symbol = symbol;
        token_info.decimals = decimals;
        token_info.mint = ctx.accounts.mint.key();
        token_info.authority = ctx.accounts.authority.key();

        Ok(())
    }

    pub fn mint_reward(
        ctx: Context<MintReward>,
        amount: u64,
    ) -> Result<()> {
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn create_nft_collection(
        ctx: Context<CreateNftCollection>,
        name: String,
        symbol: String,
        uri: String,
        seller_fee_basis_points: u16,
    ) -> Result<()> {
        require!(seller_fee_basis_points <= 10000, CharityError::InvalidCollectionSize);
        
        let collection_info = &mut ctx.accounts.collection_info;
        collection_info.name = name;
        collection_info.symbol = symbol;
        collection_info.uri = uri;
        collection_info.seller_fee_basis_points = seller_fee_basis_points;
        collection_info.mint = ctx.accounts.mint.key();
        collection_info.authority = ctx.accounts.authority.key();

        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        require!(name.len() <= 32, CharityError::InvalidNftMetadata);
        require!(symbol.len() <= 10, CharityError::InvalidNftMetadata);
        
        msg!("Starting MintNft process");
        msg!("Authority: {:?}", ctx.accounts.authority.key);
        msg!("Mint: {:?}", ctx.accounts.mint.key);
        msg!("Token Account: {:?}", ctx.accounts.token_account.key);
        msg!("Collection Mint: {:?}", ctx.accounts.collection_mint.key);
        msg!("Mint Authority: {:?}", ctx.accounts.mint_authority.key);

        let nft_info = &mut ctx.accounts.nft_info;
        msg!("Initializing NFT info account");
        nft_info.name = name;
        nft_info.symbol = symbol;
        nft_info.uri = uri;
        nft_info.mint = ctx.accounts.mint.key();
        nft_info.collection = ctx.accounts.collection_mint.key();
        nft_info.owner = ctx.accounts.authority.key();

        msg!("Minting NFT");
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
            ),
            1,
        )?;

        msg!("MintNft process completed successfully");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 8
    )]
    pub charity_data: Account<'info, CharityData>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub reward_mint: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(price_lamports: u64)]
pub struct PurchaseNft<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: Safe because we only transfer SOL to this account
    #[account(mut)]
    pub charity_wallet: AccountInfo<'info>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub reward_mint: AccountInfo<'info>,
    
    /// CHECK: This is the token account that will receive the reward
    #[account(mut)]
    pub buyer_reward_account: AccountInfo<'info>,
    
    /// CHECK: PDA for mint authority
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 10 + 1 + 32
    )]
    pub token_info: Account<'info, TokenInfo>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct MintReward<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    
    /// CHECK: This is the token account
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    
    /// CHECK: PDA for mint authority
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateNftCollection<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 10 + 200 + 2 + 32,
        seeds = [b"collection".as_ref(), mint.key().as_ref()],
        bump
    )]
    pub collection_info: Account<'info, CollectionInfo>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the token mint account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    
    /// CHECK: This is the token account
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    
    /// CHECK: This is the collection mint account
    #[account(mut)]
    pub collection_mint: AccountInfo<'info>,
    
    /// CHECK: PDA for mint authority
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: AccountInfo<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 10 + 200 + 32 + 32,
        seeds = [b"nft".as_ref(), mint.key().as_ref()],
        bump
    )]
    pub nft_info: Account<'info, NftInfo>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct CharityData {
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_decimals: u8,
    pub reward_rate: u64,
}

#[account]
pub struct TokenInfo {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub mint: Pubkey,
    pub authority: Pubkey,
}

#[account]
pub struct CollectionInfo {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub mint: Pubkey,
    pub authority: Pubkey,
}

#[account]
pub struct NftInfo {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub mint: Pubkey,
    pub collection: Pubkey,
    pub owner: Pubkey,
}
