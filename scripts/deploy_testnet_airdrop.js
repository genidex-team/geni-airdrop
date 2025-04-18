// scripts/deploy_testnet_airdrop.js
const hre = require("hardhat");

async function main() {
    const merkleRoot = "0x43b2b6307d5918829aa3b1dcdc22e53f561c133e4f63af1433369bc9e4d0fda0";

    const TestnetAirdrop = await hre.ethers.getContractFactory("TestnetAirdrop");

    const airdrop = await TestnetAirdrop.deploy(merkleRoot);
    console.log(`✅ TestnetAirdrop deployed to: ${airdrop.target}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});