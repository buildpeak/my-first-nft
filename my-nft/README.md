# NFT Tutorial

## How to write and deploy an NFT

1. Create a free account on [Alchemy](https://www.alchemy.com/)
2. Create a new project (and API key)
3. Create an Ethereum wallet(address)
4. Get some testnet ETH
5. Check balance
6. initialize a new node project
7. Install hardhat
8. Create hardhat project
9. Add project folders
10. Write our contract
11. Connect Metamask & Alchemy to your project
12. Install ethers.js

```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers@^5.0.0
```

13. Update hardhat.config.js

```javascript
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
```

14. Compile our contract

```bash
npx hardhat compile
```

15. Write deploy script

```javascript
async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy();
  await myNFT.deployed();
  console.log("Contract deployed to address:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

16. Deploy our contract

```bash
npx hardhat --network sepolia run scripts/deploy.js
```

## How to mint an NFT

1. Install Web3

```bash
npm install @alch/alchemy-web3
```

2. CREATE A MINT-NFT.JS FILE

```javascript
// scripts/mint-nft.js
require("dotenv").config();
const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
```

## Reference

- https://ethereum.org/en/developers/tutorials/how-to-write-and-deploy-an-nft/
