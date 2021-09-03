//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "./MommyToken.sol";


contract FarmToken is ERC20 {
    //   using SafeMath for uint256; // As of Solidity v0.8.0, mathematical operations can be done safely without the need for SafeMath
    using Address for address;
    using SafeERC20 for IERC20;

    //assign the token Contract to a variable
    //MommyToken private momtoken; // I believe this is done via IERC20 Var

    IERC20 public token;

    constructor(address _token) public ERC20("FarmToken", "FRM") {
        token = IERC20(_token);
    }


    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }


    function deposit(uint256 _amount) public {
        // Amount must be greater than zero
        require(_amount > 0, "amount cannot be 0");

        // Transfer MyToken to smart contract
        token.safeTransferFrom(msg.sender, address(this), _amount);  //address(this) refers to the address of the instance of the contract where the call is being made
        //Basically sending my stuff to the contract

        // Mint FarmToken to msg sender
        //_mint(msg.sender, _amount);
        //Just deposit and will build interest for now
    }

    function withdraw(uint256 _amount) public {
        // Burn FarmTokens from msg sender
       // _burn(msg.sender, _amount);


        // Mint FarmToken to msg sender - Transfer Earned Tokens
        _mint(msg.sender, _amount);  // currently matching input vs output
        // Transfer MyTokens from this smart contract to msg sender
        token.safeTransfer(msg.sender, _amount);
    }


}