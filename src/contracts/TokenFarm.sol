// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // this is a "state" variable
    string public name = "DApp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    // MAPS
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public hasStaked;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // stakeTokens transfers tokens from the investor's wallet
    // and deposits them into this contract
    function stakeTokens(uint _amount) public {
        // all ERC20 tokens have a transferFrom method
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        isStaking[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, "Only the contract owner can issue tokens.");

        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            // 1:1 exchange
            dappToken.transfer(recipient, balance);
        }
    }
}
