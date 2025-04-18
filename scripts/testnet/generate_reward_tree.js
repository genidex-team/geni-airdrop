

const fs = require('fs');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const treeHelper = require('../../helpers/tree.h');
const data = require('../../../geni_data/index');

// ========= 1. INPUT DATA ========= //
const rewards = data.testnetAirdrop.getRewardsInput();
console.log('✅ Input data loaded:', rewards);

const values = treeHelper.parseRewardInput(rewards);
console.log(`values`, values);

const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

console.log('Merkle Root:', tree.root);
// fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

data.testnetAirdrop.setRewardTree(tree.dump());

