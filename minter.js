const { SigningCosmWasmClient, Secp256k1Pen, coins } = require("secretjs");

async function mintNFT() {
  // Your secret network node URL
  const rpcUrl = "https://your-secret-network-rpc-url.com";

  // Create a client to interact with the network
  const client = new SigningCosmWasmClient(rpcUrl, yourPrivateKey);

  // Define contract address and sender address
  const contractAddress = "your-contract-address";
  const senderAddress = "your-sender-address";

  // Mint NFT parameters
  const mintMsg = {
    mint_nft: {
      token_id: "unique-token-id",
      owner: senderAddress,
      // Add other metadata and parameters as needed by your contract
    },
  };

  try {
    // Send a transaction to mint the NFT
    const result = await client.execute(contractAddress, mintMsg, coins(1000000, "uscrt")); // Adjust the amount and denomination as needed

    console.log("Transaction Hash:", result.transactionHash);
    console.log("Minting NFT successful!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

mintNFT();
