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
    //Look at each address for balances
    mapping (address => uint256) public tokenBalanceOf;
    mapping(address => uint256) public depositStart;

    constructor(address _token) public ERC20("FarmToken", "FRM") {
        token = IERC20(_token);
    }


    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function ownerDepositBalance() public view returns (uint256) {
        uint tempBalance = tokenBalanceOf[msg.sender];
        return tempBalance;
    }



    function deposit(uint256 _amount) public payable {
        // Amount must be greater than zero
        require(_amount > 0, "amount cannot be 0");

        // Transfer MyToken to smart contract
        token.safeTransferFrom(msg.sender, address(this), _amount);  //address(this) refers to the address of the instance of the contract where the call is being made
        //core function of the deposit
        tokenBalanceOf[msg.sender] = tokenBalanceOf[msg.sender] + _amount;
        //Basically sending my stuff to the contract

        //Start the timer of deposit
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        // Mint FarmToken to msg sender
        //_mint(msg.sender, _amount);
        //Just deposit and will build interest for now
    }

    function withdraw(uint256 _amount) public {
        // Burn FarmTokens from msg sender
       // _burn(msg.sender, _amount);
        
        require(_amount <= tokenBalanceOf[msg.sender], 'Error, not enough');

        //Calculate interest earned
        uint depositTime = block.timestamp - depositStart[msg.sender];
        // Cal interest per second 500%   5%31577600 (seconds in 365.25 days)
        //  583400891
        uint interestPerSecond = 583400891 * (tokenBalanceOf[msg.sender] / 1e16);
        uint interest = interestPerSecond * depositTime;


        // Mint FarmToken to msg sender - Transfer Earned Tokens
        _mint(msg.sender, interest);  // currently matching input vs output
        // Transfer MyTokens from this smart contract to msg sender
        token.safeTransfer(msg.sender, _amount);
        tokenBalanceOf[msg.sender] = tokenBalanceOf[msg.sender] - _amount;
        depositStart[msg.sender] =0;
    }


}