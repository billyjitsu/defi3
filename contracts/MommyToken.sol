//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";



contract MommyToken is ERC20 {

    address public minter;    

    //Emit the event that the minter change
    event MinterChange(address indexed from, address to);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        //Set owner address
        minter = msg.sender;
     //   console.log("Minter address set to:", minter);
        // Mint
        _mint(msg.sender, 200000 * (10 ** 18));
       //  console.log("Deploying", 200000, "Tokens to", msg.sender);
    }

    function mint(address _account, uint256 _amount) public {
        require(msg.sender == minter, 'Error, msg.sender does not have minter role');
        _mint(_account, _amount);
    }

    //Make this a global variable name instead of local
    function passMinterRole(address _newAddress) public returns(bool) {
        require(msg.sender == minter);
        minter = _newAddress;

        emit MinterChange(msg.sender, _newAddress);
        return true;
    }

}