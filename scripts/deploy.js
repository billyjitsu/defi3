// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  /* Turn this off for previous deployment
  const MommyToken = await hre.ethers.getContractFactory("MommyToken");
  const mom = await MommyToken.deploy("MommyToken", "MOMMY");

  await mom.deployed();
  */

 // const Bank = await hre.ethers.getContractFactory("Bank");
 // const bank = await Bank.deploy(mom.address);

 // await bank.deployed();
  const momcontract = "0x834c88758EeE333b01e52D6de610166E19E6CCd3"
  const FarmToken = await hre.ethers.getContractFactory("FarmToken");
 // const farm = await FarmToken.deploy(mom.address);
 const farm = await FarmToken.deploy(momcontract);

  //console.log("MommyToken deployed to:", mom.address);
 // console.log("Bank Contract deployed to:", bank.address)
  console.log("FarmToken deployed to:", farm.address); 

  //Keeping here for ease of use
  //[owner, addr1, addr2, _] = await ethers.getSigners();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
