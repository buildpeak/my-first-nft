import { Box, TextField } from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import { createReceipt, getReceipt } from "../util/api.js";
import {
  ConnectionRejectedError,
  connectWallet,
  getCurrentWalletConnected,
  InstallMetamask,
  NoMetamaskError,
} from "../util/metamask.js";
import { validateNRIC } from "../util/validation.js";
import NFTImage from "./NFTImage.js";
import { getCount, mintNFT } from "../util/nft.js";

const etherScanBaseUrl = process.env.REACT_APP_ETHERSCAN_BASE_URL;

const Minter = (_props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState({ color: "black", message: "👆" });
  const [nric, setNric] = useState("");
  const [nricErr, setNricErr] = useState({ error: false, message: "" });
  const [claimable, setClaimable] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);

  const setWalletAddress = useCallback(async () => {
    try {
      const address = await getCurrentWalletConnected();
      setWallet(address);
    } catch (err) {
      if (err instanceof NoMetamaskError) {
        setStatus({ color: "black", message: err.installMetamask() });
      } else {
        console.error(err);
        setStatus({ color: "red", message: err.message });
      }
    }
  }, []);

  const setCount = useCallback(async () => {
    try {
      const count = await getCount();
      setTotalMinted(count);
    } catch (err) {
      if (err instanceof NoMetamaskError) {
        setStatus({ color: "black", message: err.installMetamask() });
      } else {
        console.error(err);
        setStatus({ color: "red", message: err.message });
      }
    }
  }, []);

  useEffect(() => {
    setWalletAddress();
    addWalletListener();
    setCount();
  }, [setWalletAddress, setCount]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus({ message: "👆" });
        } else {
          setWallet("");
          setStatus({
            message: "🦊 Connect to Metamask using the top right button.",
          });
        }
      });
    } else {
      setStatus({ message: InstallMetamask() });
    }
  }

  const onConnectWalletPressed = async () => {
    try {
      const address = await connectWallet();
      setWallet(address);
    } catch (err) {
      if (err instanceof NoMetamaskError) {
        setStatus({ message: err.installMetamask() });
      } else if (err instanceof ConnectionRejectedError) {
        setStatus({ message: err.message });
      } else {
        console.error(err);
        setStatus({ message: err.message });
      }
    }
  };

  const onNricChanged = (event) => {
    const nric = event.target.value;
    setNric(nric);
    setNricErr({ error: false, message: "" });
    setClaimable(validateNRIC(nric));
  };

  const onMintPressed = async () => {
    if (!claimable) {
      setNricErr({ error: true, message: "Invalid NRIC" });
      return;
    }
    setClaimable(false);
    let receipt = "";
    try {
      receipt = await createReceipt(nric, walletAddress);
    } catch (err) {
      console.error(err);
      setNricErr({ error: true, message: err.message });
    }
    try {
      receipt = await getReceipt(nric, walletAddress);
    } catch (err) {
      console.error(err);
      setNricErr({ error: true, message: err.message });
    }

    try {
      const tokenURI = "ipfs://QmNX5QXttZ9Wj1bupJXFEiLpGdDLGE2fNpBHHTDym7ng4b";
      const txHash = await mintNFT(tokenURI, receipt);
      setTotalMinted(await getCount());
      setStatus({
        color: "green",
        message: (
          <span>
            <p>
              ✅ Check out your transaction on Etherscan:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`${etherScanBaseUrl}/tx/${txHash}`}
              >
                {txHash}
              </a>
            </p>
          </span>
        ),
      });
    } catch (err) {
      console.error(JSON.stringify(err));
      setStatus({ color: "red", message: err.reason });
    }
    setClaimable(true);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={onConnectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙 My First NFT</h1>
      <p>
        Welcome to My First NFT! To get started, connect your Ethereum wallet.
        Key in NRIC and click on Claim to mint your first NFT!
      </p>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
          p: 1,
        }}
      >
        <TextField
          id="standard-basic"
          label="NRIC"
          value={nric}
          onChange={onNricChanged}
          inputProps={{ style: { textTransform: "uppercase" }, maxLength: 9 }}
          variant="standard"
          fullWidth
          error={nricErr.error}
          helperText={nricErr.message}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          gridGap: "1rem",
          p: 1,
        }}
      >
        <button id="mintButton" onClick={onMintPressed} disabled={!claimable}>
          Claim
        </button>
      </Box>

      <p id="status" style={{ color: status.color }}>
        {status.message}
      </p>

      <div className="container">
        <div className="row">
          {totalMinted === 0 ? (
            <div className="col-sm">
              <p>Nothing minted yet</p>
            </div>
          ) : (
            Array(totalMinted)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="col-sm">
                  <NFTImage tokenId={i + 1} />
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Minter;
