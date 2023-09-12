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


  const addMinterMsg = new MsgExecuteContract({
    sender: accounts[0].address,
    contract_address: contractAddress,
    // codeHash, // Test MsgExecuteContract without codeHash
    msg: { add_minters: { minters: [accounts[0].address] } },
    sentFunds: [],
  });

  const mintMsg = new MsgExecuteContract({
    sender: accounts[0].address,
    contract_address: contractAddress,
    code_hash: codeHash,
    msg: {
      mint_nft: {
        token_id: "1",
        owner: accounts[0].address,
        public_metadata: {
          extension: {
            image:
              "https://scrt.network/secretnetwork-logo-secondary-black.png",
            name: "secretnetwork-logo-secondary-black",
          },
        },
        private_metadata: {
          extension: {
            image:
              "https://scrt.network/secretnetwork-logo-primary-white.png",
            name: "secretnetwork-logo-primary-white",
          },
        },
      },
    },
    sentFunds: [],
  });


  try {
    // Send a transaction to mint the NFT
    const tx = await secretjs.tx.broadcast([addMinterMsg, mintMsg], {
      gasLimit: 5_000_000,
    });

    console.log("Transaction Hash:", tx.transactionHash);
    console.log("Minting NFT successful!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

module.exports.mintNFT = mintNFT;
