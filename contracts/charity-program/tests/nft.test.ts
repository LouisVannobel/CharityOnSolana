import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CharityProgram } from "../target/types/charity_program";
import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, MINT_SIZE, createInitializeMintInstruction, createMintToInstruction, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, setAuthority, AuthorityType } from "@solana/spl-token";
import { assert } from "chai";

describe("Charity NFT Collection", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CharityProgram as Program<CharityProgram>;

  let collectionMint: anchor.web3.PublicKey;
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
  });


  it("Can create NFT collection", async () => {
    try {
      // Créer le mint pour la collection
      const collectionMintKeypair = anchor.web3.Keypair.generate();
      const lamports = await provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      const transaction = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: collectionMintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          collectionMintKeypair.publicKey,
          0,
          provider.wallet.publicKey,
          provider.wallet.publicKey,
        )
      );

      await provider.sendAndConfirm(transaction, [collectionMintKeypair]);

      // Créer le compte de token associé
      const associatedTokenAccount = await getAssociatedTokenAddress(
        collectionMintKeypair.publicKey,
        provider.wallet.publicKey
      );

      const createAtaIx = await createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        associatedTokenAccount,
        provider.wallet.publicKey,
        collectionMintKeypair.publicKey
      );

      await provider.sendAndConfirm(new anchor.web3.Transaction().add(createAtaIx), []);
      collectionMint = collectionMintKeypair.publicKey;

      // Créer la collection NFT
      await program.methods.createNftCollection(
        "Charity NFT Collection",
        "CHAR",
        "https://example.com/collection.json",
        500
      )
      .accounts({
        authority: provider.wallet.publicKey,
        mint: collectionMint,
        collectionInfo: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("collection"), collectionMint.toBuffer()],
          program.programId
        )[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

      console.log("Collection created with address:", collectionMint.toString());

      // Vérifier les métadonnées de la collection
      const collectionInfo = await program.account.collectionInfo.fetch(
        anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("collection"), collectionMint.toBuffer()],
          program.programId
        )[0]
      );

      assert.equal(collectionInfo.name, "Charity NFT Collection");
      assert.equal(collectionInfo.symbol, "CHAR");
      assert.equal(collectionInfo.sellerFeeBasisPoints, 500);
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  });

  it("Can mint NFT to collection", async () => {
    try {
      // Créer le mint pour le NFT
      const nftMintKeypair = anchor.web3.Keypair.generate();
      const lamports = await provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      const transaction = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: nftMintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          nftMintKeypair.publicKey,
          0,
          provider.wallet.publicKey,
          provider.wallet.publicKey,
        )
      );

      await provider.sendAndConfirm(transaction, [nftMintKeypair]);

      // Créer le compte de token associé
      const associatedTokenAccount = await getAssociatedTokenAddress(
        nftMintKeypair.publicKey,
        provider.wallet.publicKey
      );

      const createAtaIx = await createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        associatedTokenAccount,
        provider.wallet.publicKey,
        nftMintKeypair.publicKey
      );

      await provider.sendAndConfirm(new anchor.web3.Transaction().add(createAtaIx), []);

      // Transférer l'autorité de mint au PDA
      await setAuthority(
        provider.connection,
        provider.wallet.payer,
        nftMintKeypair.publicKey,
        provider.wallet.publicKey,
        AuthorityType.MintTokens,
        mintAuthority
      );

      // Mint le NFT
      await program.methods.mintNft(
        "Charity NFT #1",
        "CHAR",
        "https://example.com/nft1.json"
      )
      .accounts({
        authority: provider.wallet.publicKey,
        mint: nftMintKeypair.publicKey,
        tokenAccount: await getAssociatedTokenAddress(
          nftMintKeypair.publicKey,
          provider.wallet.publicKey
        ),
        collectionMint: collectionMint,
        mintAuthority: mintAuthority,
        nftInfo: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("nft"), nftMintKeypair.publicKey.toBuffer()],
          program.programId
        )[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

      // Vérifier les métadonnées du NFT
      const nftInfo = await program.account.nftInfo.fetch(
        anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("nft"), nftMintKeypair.publicKey.toBuffer()],
          program.programId
        )[0]
      );

      assert.equal(nftInfo.name, "Charity NFT #1");
      assert.equal(nftInfo.symbol, "CHAR");
      assert(nftInfo.collection.equals(collectionMint));
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  });
});
