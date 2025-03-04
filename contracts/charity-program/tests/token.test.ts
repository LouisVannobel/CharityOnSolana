import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CharityProgram } from "../target/types/charity_program";
import { 
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  getAccount,
  getMint,
  setAuthority,
  AuthorityType
} from "@solana/spl-token";
import { Keypair, SystemProgram, SYSVAR_RENT_PUBKEY, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("CHAR Token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CharityProgram as Program<CharityProgram>;
  
  let mint: anchor.web3.PublicKey;
  let tokenAccount: anchor.web3.PublicKey;
  let tokenInfoAccount: anchor.web3.Keypair;
  let mintAuthority: PublicKey;
  let mintAuthorityBump: number;
  
  before(async () => {
    // Trouver le PDA pour l'autorité de mint
    const [mintAuthorityPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("mint_authority")],
      program.programId
    );
    mintAuthority = mintAuthorityPDA;
    mintAuthorityBump = bump;

    // Créer le mint avec 9 décimales
    mint = await createMint(
      provider.connection,
      provider.wallet as any,  // Cast pour résoudre le problème de type
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      9
    );

    // Transférer l'autorité de mint au PDA
    await setAuthority(
      provider.connection,
      provider.wallet as any,  // Cast pour résoudre le problème de type
      mint,
      provider.wallet.publicKey,
      AuthorityType.MintTokens,
      mintAuthority
    );

    // Créer un compte token pour recevoir les tokens
    tokenAccount = await createAccount(
      provider.connection,
      provider.wallet as any,  // Cast pour résoudre le problème de type
      mint,
      provider.wallet.publicKey
    );

    tokenInfoAccount = anchor.web3.Keypair.generate();
  });

  it("Can initialize CHAR token", async () => {
    const tokenName = "CHAR";
    const tokenSymbol = "CHAR";
    const decimals = 9;

    await program.methods
      .initializeToken(tokenName, tokenSymbol, decimals)
      .accounts({
        authority: provider.publicKey,
        mint: mint,
        tokenInfo: tokenInfoAccount.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([tokenInfoAccount])
      .rpc();

    const tokenInfo = await program.account.tokenInfo.fetch(tokenInfoAccount.publicKey);
    assert.equal(tokenInfo.name, tokenName, "Token name should match");
    assert.equal(tokenInfo.symbol, tokenSymbol, "Token symbol should match");
    assert.equal(tokenInfo.decimals, decimals, "Decimals should match");
    assert(tokenInfo.mint.equals(mint), "Mint address should match");
    console.log("CHAR token initialized with name:", tokenName);
  });

  it("Can mint reward tokens", async () => {
    const amount = new anchor.BN(1000 * Math.pow(10, 9)); // 1000 tokens

    await program.methods
      .mintReward(amount)
      .accounts({
        authority: provider.publicKey,
        mint: mint,
        tokenAccount: tokenAccount,
        mintAuthority: mintAuthority,
      })
      .rpc();

    const accountInfo = await getAccount(provider.connection, tokenAccount);
    assert(accountInfo.amount.toString() === amount.toString(), "Amount should be 1000 tokens");
    console.log("Minted", amount.toString(), "reward tokens to account:", tokenAccount.toString());
  });

  it("Should fail with invalid decimals", async () => {
    const tokenName = "Invalid Token";
    const tokenSymbol = "INV";
    const invalidDecimals = 10;
    const newTokenInfo = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .initializeToken(tokenName, tokenSymbol, invalidDecimals)
        .accounts({
          authority: provider.wallet.publicKey,
          mint: mint,
          tokenInfo: newTokenInfo.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newTokenInfo])
        .rpc();
      assert.fail("Should have failed with invalid decimals");
    } catch (error) {
      assert(error.toString().includes("InvalidTokenParams"));
      console.log("Successfully caught invalid decimals error");
    }
  });
});
