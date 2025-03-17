import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CharityProgram } from "../target/types/charity_program";
import { PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  CreateCandyMachineInput,
} from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import { assert } from "chai";

describe.skip("Charity NFT Collection and Candy Machine", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CharityProgram as Program<CharityProgram>;
  let metaplex: Metaplex;
  let candyMachine: PublicKey;
  const groups = [
    { label: "tier1", size: 20, price: 1.0 },
    { label: "tier2", size: 15, price: 2.0 },
    { label: "tier3", size: 10, price: 3.5 },
    { label: "tier4", size: 5, price: 5.0 },
  ];

  before(async () => {
    const payer = Keypair.generate();
    const airdropSignature = await provider.connection.requestAirdrop(
      payer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    console.log("Airdrop completed for payer:", payer.publicKey.toString());

    metaplex = Metaplex.make(provider.connection)
      .use(keypairIdentity(payer))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: provider.connection.rpcEndpoint,
        timeout: 60000,
      }));

    console.log("Metaplex instance created");
  });

  it("Can create Candy Machine with price tiers", async () => {
    console.log("Starting Candy Machine creation");
    const { candyMachine: cm } = await metaplex.candyMachines().create({
      itemsAvailable: 50,
      sellerFeeBasisPoints: 500,
      symbol: "CHAR",
      maxEditionSupply: 0,
      isMutable: true,
      creators: [
        {
          address: provider.wallet.publicKey,
          share: 100,
        },
      ],
      groups: groups.map(group => ({
        label: group.label,
        size: group.size,
        price: group.price,
      })),
    });

    candyMachine = cm.address;
    console.log("Candy Machine created:", candyMachine.toString());

    const candyMachineAccount = await metaplex.candyMachines().findByAddress({
      address: candyMachine,
    });

    assert.equal(
      candyMachineAccount.itemsAvailable.toString(),
      "50",
      "Total items available should be 50"
    );
  });

  it("Can add items to different price tiers", async () => {
    for (const group of groups) {
      const items = Array(group.size).fill(null).map((_, i) => ({
        name: `Charity NFT ${group.label} #${i + 1}`,
        uri: `https://arweave.net/${group.label}/${i}`,
        group: group.label,
      }));

      await metaplex.candyMachines().insertItems({
        candyMachine,
        items,
      });

      console.log(`Added ${items.length} items to ${group.label}`);
    }

    const candyMachineAccount = await metaplex.candyMachines().findByAddress({
      address: candyMachine,
    });

    assert.equal(
      candyMachineAccount.items.length,
      50,
      "Should have all 50 items"
    );
  });

  it("Can mint NFT from different price tiers", async () => {
    for (const group of groups) {
      const { nft } = await metaplex.candyMachines().mint({
        candyMachine,
        group: group.label,
      });

      console.log(`Minted NFT from ${group.label}:`, nft.address.toString());

      const mintedNft = await metaplex.nfts().findByMint({
        mintAddress: nft.address,
      });

      assert.equal(
        mintedNft.symbol,
        "CHAR",
        "Minted NFT should have correct symbol"
      );

      // Vérifier que le prix correspond au tier
      const price = await metaplex.candyMachines().getPriceForGroup({
        candyMachine,
        group: group.label,
      });

      assert.equal(
        price.basisPoints.toString(),
        (group.price * 1e9).toString(),
        `Price should be ${group.price} SOL for ${group.label}`
      );
    }
  });
});
