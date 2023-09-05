import { ethers } from "ethers";
import nftContract from "../MyNFT.json";
import { NoMetamaskError } from "./metamask";

const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY;

const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

export const getProvider = () => {
  if (!window.ethereum) {
    throw new NoMetamaskError();
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

export const getContract = () => {
  const provider = getProvider();
  const contract = new ethers.Contract(
    contractAddress,
    nftContract.abi,
    provider
  );

  return contract;
};

export const getCount = async () => {
  const contract = getContract();
  const count = await contract.count();
  return parseInt(count);
};

export const getTokenURI = async (tokenId) => {
  const contract = getContract();
  const uri = await contract.tokenURI(String(tokenId));
  return uri;
};

export const fetchMetadata = async (uri) => {
  uri = ipfsGateway + uri.split("ipfs://").pop();
  const response = await fetch(uri);
  const json = await response.json();
  return json;
};

export const fetchImage = async (uri) => {
  uri = ipfsGateway + uri.split("ipfs://").pop();
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export const mintNFT = async (tokenURI, receipt) => {
  if (receipt === "") {
    throw new Error("Invalid receipt");
  }
  if (tokenURI === "") {
    throw new Error("Invalid tokenURI");
  }
  if (!contractAddress) {
    throw new Error("Invalid contract address");
  }

  const provider = getProvider();
  const contract = getContract();

  const signer = await provider.getSigner();

  const connection = contract.connect(signer);

  const txParams = {
    to: contractAddress,
    from: signer.address,
    data: connection.interface.encodeFunctionData("mintNFT", [
      signer.address,
      tokenURI,
      receipt,
    ]),
  };

  try {
    const tx = await signer.sendTransaction(txParams);
    const txReceipt = await tx.wait();

    console.log(txReceipt);

    return txReceipt.hash;
  } catch (err) {
    throw err;
  }
};
