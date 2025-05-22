// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestnetAirdrop is Ownable {
    bytes32 public rewardRoot;
    mapping(address => bool) public hasClaimed;
    IERC20 public geniToken;

    event Claimed(address indexed user, uint256 amount);

    constructor(address _geniToken, bytes32 _rewardRoot) Ownable(msg.sender){
        geniToken = IERC20(_geniToken);
        rewardRoot = _rewardRoot;
    }

    function claim(
        uint256 amount,
        bytes32[] calldata proof,
        bytes32 salt
    ) external {
        require(!hasClaimed[msg.sender], "Already claimed");

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, amount, salt)))
        );
        require(MerkleProof.verify(proof, rewardRoot, leaf), "Invalid proof");
        require(geniToken.balanceOf(address(this)) >= amount, "Not enough tokens");

        hasClaimed[msg.sender] = true;
        geniToken.transfer(msg.sender, amount);

        emit Claimed(msg.sender, amount);
    }

    function withdrawRemainingTokens() external onlyOwner {
        uint256 balance = geniToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(geniToken.transfer(owner(), balance), "Withdraw failed");
    }

}
