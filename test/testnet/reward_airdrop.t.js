const { expect } = require("chai");
const { ethers } = require("hardhat");
const data = require("../../../geni_data/index");

describe("TestnetAirdrop", function () {
  let TestnetAirdrop, airdrop;
  const rewardRoot = data.testnetAirdrop.getRewardRoot();
  const referralRoot = data.testnetAirdrop.getReferralRoot();

  beforeEach(async function () {
    TestnetAirdrop = await ethers.getContractFactory("TestnetAirdrop");
    airdrop = await TestnetAirdrop.deploy(rewardRoot, referralRoot);
  });

  it("should deploy with correct merkle root", async function () {
    expect(await airdrop.rewardRoot()).to.equal(rewardRoot);
  });

  it("should reject invalid proof", async function () {
    const [owner, trader1] = await ethers.getSigners();
    // console.log(trader1.address);
    const invalidProof = ["0x4b03d8918f6bb1126b8dec10a8810cdbd2eb33be00ca94f2d8bda28b99d11f6b"];
    const amount = data.testnetAirdrop.getRewardAmount(trader1.address);
    await expect(
      airdrop.connect(trader1).claim(amount, invalidProof)
    ).to.be.revertedWith("Invalid proof");
  });

  it("should verify valid proof", async function () {
    const [owner, trader1, trader2] = await ethers.getSigners();
    
    const proof = data.testnetAirdrop.getRewardProof(trader1.address);
    let amount = data.testnetAirdrop.getRewardAmount(trader1.address);
    console.log('proof', proof);
    console.log('amount', amount);
    let result = await airdrop.connect(trader1).claim(amount, proof);
    expect(result).to.emit(airdrop, "Claimed")
      .withArgs(trader1.address, amount);
  });

});