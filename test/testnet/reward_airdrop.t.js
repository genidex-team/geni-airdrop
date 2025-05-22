const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const data = require("geni_data");
const shell = require("../../helpers/shell");
const helper = require('../../helpers/helper');

describe("TestnetAirdrop", async function () {
  let rewardRoot;
  let airdropContract, testToken;
  let owner, trader1, trader2;
  let proof, amount, salt;

  before(async function () {
     [owner, trader1, trader2] = await ethers.getSigners();
     proof = data.testnetAirdrop.getRewardProof(trader1.address);
     amount = data.testnetAirdrop.getRewardAmount(trader1.address);
     salt = data.testnetAirdrop.getRewardSalt(trader1.address);
  });

  beforeEach(async function () {
    // deploy TestToken
    testToken = await helper.deployTestToken();
    // console.log('testToken', testToken.target)

    // deploy TestnetAirdrop
    rewardRoot = data.testnetAirdrop.getRewardRoot();
    const TestnetAirdrop = await ethers.getContractFactory("TestnetAirdrop");
    airdropContract = await TestnetAirdrop.deploy(testToken.target, rewardRoot);
    // console.log('airdrop', airdropToken.target);

    await helper.transfer(testToken, "1000000", airdropContract.target)
  });

  it("should deploy with correct merkle root", async function () {
    expect(await airdropContract.rewardRoot()).to.equal(rewardRoot);
  });

  it("should reject invalid proof", async function () {
    const [owner, trader1] = await ethers.getSigners();
    // console.log(trader1.address);
    const invalidProof = ["0x4b03d8918f6bb1126b8dec10a8810cdbd2eb33be00ca94f2d8bda28b99d11f6b"];
    try{
      // await airdropToken.connect(trader1).claim(amount, invalidProof, salt);
      await expect(
         airdropContract.connect(trader1).claim(amount, invalidProof, salt)
      ).to.be.revertedWith("Invalid proof");
    }catch(error){
      console.error('error', error);
      const decoded = airdropContract.interface.parseError(error.data.data);
      console.log('decoded', decoded);
    }
  });
// return;
  it("should verify valid proof", async function () {
    try{
      let result = await airdropContract.connect(trader1).claim(amount, proof, salt);
      expect(result).to.emit(airdropContract, "Claimed")
        .withArgs(trader1.address, amount);
    }catch(error){
      console.error('error', error);
      const decoded = airdropContract.interface.parseError(error.data.data);
      console.log('decoded', decoded);
    }
  });

  it("should revert if user tries to claim twice", async function () {
    // first claim
    await airdropContract.connect(trader1).claim(amount, proof, salt);
    // second claim
    await expect(
      airdropContract.connect(trader1).claim(amount, proof, salt)
    ).to.be.revertedWith("Already claimed");

  });

  it("should correctly transfer token to user on claim", async () => {
    const beforeUser = await testToken.balanceOf(trader1.address);
    const beforeContract = await testToken.balanceOf(airdropContract.target);

    // Simulate successful claim
    await airdropContract.connect(trader1).claim(amount, proof, salt);

    const afterUser = await testToken.balanceOf(trader1.address);
    const afterContract = await testToken.balanceOf(airdropContract.target);

    expect(afterUser - beforeUser).to.equal(amount);
    expect(beforeContract - afterContract).to.equal(amount);
  });

  it("should allow owner to withdraw all remaining tokens", async () => {
    const beforeOwner = await testToken.balanceOf(owner.address);
    const contractBalance = await testToken.balanceOf(airdropContract.target);

    const tx = await airdropContract.connect(owner).withdrawRemainingTokens();
    await tx.wait();

    const afterOwner = await testToken.balanceOf(owner.address);
    const afterContract = await testToken.balanceOf(airdropContract.target);

    expect(afterContract).to.equal(0n);
    expect(afterOwner).to.equal(beforeOwner + contractBalance);
  });

  it("should revert if no tokens left", async () => {
    await airdropContract.connect(owner).withdrawRemainingTokens();
    await expect(
      airdropContract.connect(owner).withdrawRemainingTokens()
    ).to.be.revertedWith("No tokens to withdraw");
  });

  it("should revert if non-owner tries to withdraw", async () => {
    await expect(
      airdropContract.connect(trader1).withdrawRemainingTokens()
    ).to.be.revertedWithCustomError(airdropContract, "OwnableUnauthorizedAccount").withArgs(trader1.address);
  });

});