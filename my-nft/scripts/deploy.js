async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT");

  const gasPrice = await MyNFT.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const mintingStartTime = Math.floor(Date.now() / 1000);
  const mintingEndTime = mintingStartTime + 30 * 24 * 3600; // 30 days
  const maxMintingLimit = 5;

  const estimatedGas = await MyNFT.signer.estimateGas(
    MyNFT.getDeployTransaction(
      maxMintingLimit,
      mintingStartTime,
      mintingEndTime
    )
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await MyNFT.signer.getBalance();
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );
  console.log(
    `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
  );

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(
    maxMintingLimit,
    mintingStartTime,
    mintingEndTime
  );
  await myNFT.deployed();
  console.log("Contract deployed to address:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
