const { expect } = require("chai");
const { ethers } = require("hardhat");
const data = require("../../../geni_data/index");

describe("TestnetAirdrop", function () {
  let TestnetAirdrop, airdrop;
  const rewardRoot = "0x43b2b6307d5918829aa3b1dcdc22e53f561c133e4f63af1433369bc9e4d0fda0";
  const referralRoot = "0xe5f4c9e35ab1cd7c86c29eea595237597abb8015a4aa1e194e5f738ec17cd07e";


  beforeEach(async function () {
    TestnetAirdrop = await ethers.getContractFactory("TestnetAirdrop");
    airdrop = await TestnetAirdrop.deploy(rewardRoot, referralRoot);
  });

  it("should deploy with correct merkle root", async function () {
    expect(await airdrop.referralRoot()).to.equal(referralRoot);
  });

  /*it("should reject invalid proof", async function () {
    const [owner, claimer] = await ethers.getSigners();
    // console.log(claimer.address);
    const invalidProof = ["0x4b03d8918f6bb1126b8dec10a8810cdbd2eb33be00ca94f2d8bda28b99d11f6b"];//treeHelper.getTestnetAirdropRewardProof(claimer.address);
    const referees = data.testnetAirdrop.getReferees(claimer.address);
    await expect(
      airdrop.verifyReferral(invalidProof, claimer.address, referees)
    ).to.be.revertedWith("Invalid proof");
  });*/

  it("should verify valid proof", async function () {
    const [owner, claimer] = await ethers.getSigners();
    // console.log(claimer.address);
    const proof = data.testnetAirdrop.getReferralProof(claimer.address);
    const referees = data.testnetAirdrop.getReferees(claimer.address);
    console.log('referees', referees);

    let result = await airdrop.verifyReferral(proof, claimer.address, referees);
    expect(result).to.equal(true);
  });

});