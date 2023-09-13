const { SecretNetworkClient, Wallet, Secp256k1Pen, coins } = require("secretjs");
const fs = require('fs');
require('dotenv').config();

const contract_wasm = fs.readFileSync(
  "./snip721/contract.wasm.gz"
);

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

  let codeId = 934;
  let contractCodeHash =
    "a448595e3a46197776ff966c980d0de770c052c7f1ced1577027906835126bd5";
  let contractAddress = "secret1xjvnf8fru5xe2x73g6mdfef9zcj00umhvvzqsp";

  let upload_contract = async () => {
    let tx = await secretjs.tx.compute.storeCode(
      {
        sender: wallet.address,
        wasm_byte_code: contract_wasm,
        source: "",
        builder: "",
      },
      {
        gasLimit: 5_000_000,
      }
    );

    if (tx.code) throw tx.raw_log;


    const codeId = Number(
      tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
        .value
    );
  
    console.log("codeId: ", codeId);
  
    const contractCodeHash = (
      await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
    ).code_hash;
    console.log(`Contract hash: ${contractCodeHash}`);
  };

  upload_contract();
  
  let instantiate_contract = async () => {
    // Create an instance of the Counter contract, providing a starting count
    const initMsg = {};
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        code_id: codeId,
        sender: wallet.address,
        code_hash: contractCodeHash,
        init_msg: initMsg,
        label: "Secret Millionaire" + Math.ceil(Math.random() * 10000),
      },
      {
        gasLimit: 400_000,
      }
    );
  
    //Find the contract_address in the logs
    const contractAddress = tx.arrayLog.find(
      (log) => log.type === "message" && log.key === "contract_address"
    ).value;
  
    console.log(contractAddress);
  };
  
  instantiate_contract();


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

    if (tx.code) throw tx.raw_log;

    console.log("Transaction Hash:", tx.transactionHash);
    console.log("Minting NFT successful!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

module.exports.mintNFT = mintNFT;
