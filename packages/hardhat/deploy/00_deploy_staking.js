// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const admin = "0xd1a8Dd23e356B9fAE27dF5DeF9ea025A602EC81e";
  const trustedSigner = "0xd1a8Dd23e356B9fAE27dF5DeF9ea025A602EC81e";

  // const Token = await deploy("Token", {
  //   from: deployer,
  //   log: true,
  //   waitConfirmations: 5,
  // });

  const Token = { address: "0x5D5c5c1d14FaF8Ff704295b2F502dAA9D06799a0" };

  const stakingArgs = [Token.address, trustedSigner];

  await deploy("NNNStaking", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: stakingArgs,
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const NNNStaking = await ethers.getContract("NNNStaking", deployer);

  // Create Periods 
  // use https://www.unixtimestamp.com/ to convert date to timestamp
  // deploy period 1
  await NNNStaking.createPeriod(
    1665518188, // start time (time now)
    1697054188, // timestamp for 1 years from now
    5,
    "Staking Novem Gold Token fo 1 Year 5% APY"
  );


   // deploy period 2
   await NNNStaking.createPeriod(
    1665518188, // start time (time now)
    1697054188, // timestamp for 2 years from now
    6,
    "Staking Novem Gold Token fo 2 Year 6% APY"
  );


  // deploy period 3
  await NNNStaking.createPeriod(
    1665518188, // start time (time now)
    1697054188, // timestamp for 5 years from now
    8,
    "Staking Novem Gold Token fo 5 Year 8% APY"
  );


  await NNNStaking.transferOwnership(admin);

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  try {
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: NNNStaking.address,
        contract: "contracts/NNNStaking.sol:NNNStaking",
        constructorArguments: stakingArgs,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["NNNStaking", "Token"];
