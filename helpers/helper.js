
class Helper{

    async deployTestToken(){
        const TestToken = await ethers.getContractFactory("TestToken");
        const initialSupply = ethers.parseUnits("1000000000", 18);
        const token = await TestToken.deploy(initialSupply);
        await token.waitForDeployment();
        // console.log("Token deployed at:", token.target);
        return token;
    }

    async transfer(token, strAmount, to){
        const depositAmount = ethers.parseUnits(strAmount, 18);
        const tx = await token.transfer(to, depositAmount);
        await tx.wait();
        // console.log(`Successfully transferred ${strAmount}`);
    }
}

module.exports = new Helper();