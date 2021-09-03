const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FarmToken", function () {
  let MommyToken, mom, FarmToken, farm, owner, addr1, addr2;
  
  beforeEach(async () => {
    MommyToken = await hre.ethers.getContractFactory("MommyToken");
    mom = await MommyToken.deploy("MommyToken", "MOMMY");
    await mom.deployed();
    FarmToken = await hre.ethers.getContractFactory("FarmToken");
    farm = await FarmToken.deploy(mom.address);
    await farm.deployed();
    [owner, addr1, addr2, _] = await ethers.getSigners();
  })
  
  describe("Check Mommy Token", () => {
    it("Should have the right balance of MomTokens", async () => {
        const ownerBalance = await mom.balanceOf(owner.address) 
        //work on this
        //console.log(ownerBalance).to.String()
        expect (await mom.totalSupply()).to.equal(ownerBalance);
    })

    it("Should Transfer from Owner address to another address", async () => {
      await expect(mom.transfer(addr1.address, 10))
        .to.emit(mom, "Transfer")
        .withArgs(owner.address, addr1.address, 10)
    })
  })

  describe("Check on Farm", () => {
    it("Should be able to approve and deposit", async () => {
      const previousBalance = await mom.balanceOf(owner.address)
      await mom.approve(farm.address, 10000)
      await farm.deposit(20)
      const currentBalance = await mom.balanceOf(owner.address)
      // Just need to make sure that balance is not there
      expect(currentBalance).to.not.equal(previousBalance)
      // Don't know how to set an actuall equal value witout overflow
    })
    it("Should be able to withdraw", async () => {
      const previousBalance = await mom.balanceOf(owner.address)
      const dadBefore = await farm.balanceOf(owner.address)
      await mom.approve(farm.address, 10000)
      await farm.deposit(20)
      await farm.withdraw(20)
      const currentBalance = await mom.balanceOf(owner.address)
      expect(currentBalance).to.equal(previousBalance)
      const dadAfter = await farm.balanceOf(owner.address)
      expect(dadBefore).to.not.equal(dadAfter)
    })
      



  })

});
