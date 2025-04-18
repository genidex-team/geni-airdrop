// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TestnetAirdrop {
    bytes32 public rewardRoot;
    bytes32 public referralRoot;
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed user, uint256 amount);

    constructor(bytes32 _rewardRoot, bytes32 _referralRoot) {
        rewardRoot = _rewardRoot;
        referralRoot = _referralRoot;
    }

    function claim(
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        require(!hasClaimed[msg.sender], "Already claimed");

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, amount)))
        );
        require(MerkleProof.verify(proof, rewardRoot, leaf), "Invalid proof");

        hasClaimed[msg.sender] = true;
        // ERC20(token).transfer(msg.sender, amount);

        emit Claimed(msg.sender, amount);
    }

    function verifyReferral(
        bytes32[] calldata proof,
        address referrer,
        address[] calldata referees
    ) public view returns (bool) {
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(referrer, referees)))
        );
        require(MerkleProof.verify(proof, referralRoot, leaf), "Invalid proof");
        return true;
    }
}
