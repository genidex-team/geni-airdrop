// scripts/deploy_testnet_airdrop.js

const {ethers} = require("hardhat");
const data = require("geni_data");

async function main() {
    const rewardRoot = data.testnetAirdrop.getRewardRoot();
    // const referralRoot = data.testnetAirdrop.getReferralRoot();

    const TestnetAirdrop = await ethers.getContractFactory("TestnetAirdrop");
    const geniTokenAddr = data.getGeniTokenAddress(network.name);
    console.log({geniTokenAddr, rewardRoot})
    const airdrop = await TestnetAirdrop.deploy(geniTokenAddr, rewardRoot);
    data.testnetAirdrop.setAddress(network.name, airdrop.target);
    console.log(`✅ TestnetAirdrop deployed to: ${airdrop.target}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});