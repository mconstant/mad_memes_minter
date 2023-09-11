const { SecretNetworkClient, Wallet, Secp256k1Pen, coins } = require("secretjs");
require('dotenv').config();

async function mintNFT() {
  // Your secret network node URL
  const rpcUrl = process.env.RPC_URL || "https://api.secrettestnet.io"; // Default to a testnet URL if not set

  const pKey = process.env.PKEY

  //import wallet
  const wallet = new Wallet(process.env.MNEMONIC);

  // Create a client to interact with the network
  const secretjs = new SecretNetworkClient({
    url: process.env.SECRET_LCD_URL,
    wallet: wallet,
    walletAddress: wallet.address,
    chainId: process.env.SECRET_CHAIN_ID,
  });


  // Define contract address and sender address
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const senderAddress = process.env.SENDER_ADDRESS;

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
    const result = await secretjs.execute(contractAddress, mintMsg, coins(1000000, "uscrt")); // Adjust the amount and denomination as needed

    console.log("Transaction Hash:", result.transactionHash);
    console.log("Minting NFT successful!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

module.exports.mintNFT = mintNFT;
