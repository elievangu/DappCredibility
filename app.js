let abi = [
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "dev",
        type: "bytes32",
      },
    ],
    name: "remettre",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "destinataire",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "valeur",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "cred",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "hashs",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "ordre",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "string",
        name: "url",
        type: "string",
      },
    ],
    name: "produireHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
];

async function createMetaMaskDapp() {
  try {
    //Demande à MetaMask l'autorisation de se connecter
    const addresses = await ethereum.enable();
    const address = addresses[0];
    //Connection au client Ethereum fourni par l'objet web3
    const provider = new ethers.providers.Web3Provider(ethereum);

    dapp = { address, provider };
    console.log(dapp);
    balance();
    getNumber();
    getPrice();
  } catch (err) {
    console.log(err);
  }
}
//Instanciation du contrat Crédibilité à partir de l'Adresse et ABI
async function getCred() {
  try {
    const address = "0x1155146ee2e814AB6Fe8feAc4090C148B0D4351B";

    const contratCredibilite = new ethers.Contract(address, abi, dapp.provider);
    console.log(contratCredibilite);

    const maCredibilite = await contratCredibilite.cred(dapp.address);
    document.getElementById("cred").innerHTML = maCredibilite.toString();
    console.log(maCredibilite.toString());
  } catch (err) {
    console.log(err);
  }
}

async function deposit() {
  try {
    const address = "0x1155146ee2e814AB6Fe8feAc4090C148B0D4351B";  
    let privateKey =
      "0x0123456789012345678901234567890123456789012345678901234567890123";
    const provider = new ethers.providers.Web3Provider(ethereum);
    let wallet = new ethers.Wallet(privateKey, provider);
    let contractWithSigner = new ethers.Contract(address, abi, wallet);
    const text = document.getElementById("input").value;
    
    const produireHash = await contractWithSigner.produireHash(text);
    //const deposer = await contractWithSigner.remettre(produireHash);
    document.getElementById("input").value = "";
    getCred();
    console.log(produireHash)
  } catch (err) {
      console.log(err)
  }
}

async function balance() {
  dapp.provider.getBalance(dapp.address).then((balance) => {
    let etherString = ethers.utils.formatEther(balance);
    document.getElementById("balance").innerHTML = `${etherString} ETH`;
    console.log("Balance:" + etherString);
  });
}
async function getNumber() {
  dapp.provider.getBlockNumber().then((blockNumber) => {
    document.getElementById("block").innerHTML = `${blockNumber}`;
    console.log(blockNumber);
  });
}
async function getPrice() {
  dapp.provider.getGasPrice().then((gasPrice) => {
    gasPriceString = gasPrice.toString();
    document.getElementById("price").innerHTML = `${gasPriceString} wei`;
    console.log(gasPriceString);
  });
}
