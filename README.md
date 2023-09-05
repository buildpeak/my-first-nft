# NFT Test App

## Get Started

1. Clone the repo:

```bash
# Change to your workspace directory
cd ~/workspace/

git clone https://github.com/buildpeak/my-first-nft.git
```

2. Compile and deploy NFT contract

   2.1. Install dependencies

   ```bash
   cd ./my-nft/

   npm install
   ```

   2.2. Create `.env` file

   ```bash
    API_URL='Your_alchemy_api_url'
    PRIVATE_KEY='Your_private_key'
    PUBLIC_KEY='Your_account_address'

   ```

   2.3. Compile and deploy contract

   ```bash
   npx hardhat compile

   npx hardhat run scripts/deploy.js --network sepolia
   ```

   2.4. Copy contract address and paste it in `./web-app/.env` file

   ```bash
   REACT_APP_NFT_CONTRACT_ADDRESS=0x5Dba813f7F6133c81cDCbc70bF329F591228d3c8
   ```

   2.5. Copy contract JSON to `./web-app/src`

   ```bash
   cp ./artifacts/contracts/MyNFT.sol/MyNFT.json ../web-app/src/
   ```

3. Start Backend API

   ```bash
   cd ./api/

   docker-compose up
   ```

4. Start Frontend App

   4.1. Install dependencies

   ```bash
   cd ./web-app/

   npm install
   ```

   4.2 Create `.env` file

   ```bash
   REACT_APP_API_BASE_URL=http://localhost:8080
   REACT_APP_NFT_CONTRACT_ADDRESS=0x5Dba813f7F6133c81cDCbc70bF329F591228d3c8
   REACT_APP_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io/tx
   REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
   # REACT_APP_ALCHEMY_API_URL=Your_alchemy_api_url # Optional
   ```

   4.3. Start app

   ```bash
   npm start
   ```
