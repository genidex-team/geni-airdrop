
const keccak256 = require('keccak256');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const data = require('../../geni_data/index');

class Tree {

    parseRewardInput(rewards) {
        const values = [];
        for (let _address in rewards) {
            const addr = _address.toLowerCase();
            if (addr !== _address) {
                console.error(`❌ Address "${_address}" is not lowercase. Please normalize all addresses.`);
                process.exit(1);
            }
            const amount = rewards[_address].amount.toString();
            values.push([addr, amount]);
        }
        return values;
    }

    parseReferralInput(referrals) {
        const values = [];
        for (let _referrer in referrals) {
            const addr = _referrer.toLowerCase();
            if (addr !== _referrer) {
                console.error(`❌ Address "${_referrer}" is not lowercase. Please normalize all addresses.`);
                process.exit(1);
            }
            const referees = referrals[addr];
            // check referee is not lowercase
            for (let i = 0; i < referees.length; i++) {
                const referee = referees[i].toLowerCase();
                if (referee !== referees[i]) {
                    console.error(`❌ Address "${referees[i]}" is not lowercase. Please normalize all addresses.`);
                    process.exit(1);
                }
                referees[i] = referee;
            }
            values.push([addr, referees]);
        }
        return values;
    }

    
}

module.exports = new Tree();