const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const treeHelper = require('../../helpers/tree.h');
const data = require('../../../geni_data/index');

// ========= 1. INPUT DATA ========= //
const referrals = data.testnetAirdrop.getReferralInput();
console.log('✅ Input data loaded:', referrals);

const values = treeHelper.parseReferralInput(referrals);
console.log(`values`, values);

const tree = StandardMerkleTree.of(values, ["address", "address[]"]);

console.log('Merkle Root:', tree.root);
data.testnetAirdrop.setReferralTree(tree.dump());

