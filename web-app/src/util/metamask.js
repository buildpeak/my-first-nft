// Purpose: To connect to the user's metamask wallet

import nftContract from "../MyNFT.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const alchemyApiUrl = process.env.REACT_APP_ALCHEMY_API_URL;
const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

export const InstallMetamask = () => {
  return (
    <span>
      <p>
        {" "}
        🦊{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://metamask.io/download.html`}
        >
          You must install Metamask, a virtual Ethereum wallet, in your browser.
        </a>
      </p>
    </span>
  );
};

export class NoMetamaskError extends Error {
  constructor() {
    super();
    this.name = "NoMetamaskError";
    this.message = "No Metamask detected.";
  }

  installMetamask = InstallMetamask;
}

export class ConnectionRejectedError extends Error {
  constructor() {
    super();
    this.name = "ConnectionRejectedError";
    this.message =
      "Connection to wallet was rejected. 🦊 Connect to Metamask using the top right button.";
  }
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return window.ethereum.selectedAddress || addressArray[0];
    } catch (err) {
      throw new Error("😥 " + err.message);
    }
  } else {
    throw new NoMetamaskError();
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return window.ethereum.selectedAddress || addressArray[0];
      } else {
        throw new ConnectionRejectedError();
      }
    } catch (err) {
      throw new Error("😥 " + err.message);
    }
  } else {
    throw new NoMetamaskError();
  }
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

  const web3 = createAlchemyWeb3(alchemyApiUrl);
  const contract = new web3.eth.Contract(nftContract.abi, contractAddress);

  const txParams = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    data: contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI, receipt)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });
    return txHash;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
