import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { assert } from "chai";

describe("Solana Connection", () => {
  it("should connect to Solana devnet", async () => {
    const connection = new Connection("https://api.devnet.solana.com");
    const version = await connection.getVersion();
    console.log("Connection version:", version);
    assert(version !== undefined, "Version should be defined");
    assert(version["solana-core"] !== undefined, "Solana core version should be defined");
  });

  it("should get recent blockhash", async () => {
    const connection = new Connection("https://api.devnet.solana.com");
    const blockhash = await connection.getLatestBlockhash();
    console.log("Recent blockhash:", blockhash);
    assert(blockhash.blockhash !== undefined, "Blockhash should be defined");
    assert(blockhash.lastValidBlockHeight > 0, "Last valid block height should be greater than 0");
  });
});
