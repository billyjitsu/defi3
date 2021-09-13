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
    uint256 bonus = 5 * 10 **18;
    IERC20 public token;
    //Look at each address for balances
    mapping (address => uint256) public tokenBalanceOf;
    mapping (address => uint256) public depositStart;
    mapping (address => uint256) public primaryDeposit;
    // for testing purposes
    address public owner;

    constructor(address _token) public ERC20("FarmToken", "FRM") {
        token = IERC20(_token);
        //own the contract for failures
        owner = msg.sender;
    }


    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function ownerDepositBalance() public view returns (uint256) {
        uint tempBalance = tokenBalanceOf[msg.sender];
        return tempBalance;
    } 

    function checkTime() public view returns (uint256) {
        uint time = depositStart[msg.sender];
        return time;
    } 

 /*      function ownerInterestBalance() public view returns (uint256) {
        //Calculate interest earned
        uint256 depositTime = block.timestamp - depositStart[msg.sender];
        // Cal interest per second 500%   5%31577600 (seconds in 365.25 days)
        //  583400891
        uint256 interestPerSecond = 58340089 * (tokenBalanceOf[msg.sender] / 1e16);
        uint256 interest = interestPerSecond * depositTime;
        return interest;
    }

*/
    function deposit(uint256 _amount) public payable {
        // Amount must be greater than zero
        require(_amount > 0, "amount cannot be 0");

        if(tokenBalanceOf[msg.sender] == 0){
        //Start the timer of deposit
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        primaryDeposit[msg.sender] = depositStart[msg.sender];
        }

        // Transfer MyToken to smart contract
        token.safeTransferFrom(msg.sender, address(this), _amount);  //address(this) refers to the address of the instance of the contract where the call is being made
        //core function of the deposit
        //Basically sending my stuff to the contract

        tokenBalanceOf[msg.sender] = tokenBalanceOf[msg.sender] + _amount;
        
        // Mint FarmToken to msg sender
        //_mint(msg.sender, _amount);
        //Just deposit and will build interest for now
    }

    function withdraw(uint256 _amount) public {
        // Burn FarmTokens from msg sender
       // _burn(msg.sender, _amount);
        
        require(_amount <= tokenBalanceOf[msg.sender], 'Error, not enough');
        
        //Calculate interest earned
    //    uint256 depositTime = block.timestamp - depositStart[msg.sender];
        // Cal interest per second 500%   5%31577600 (seconds in 365.25 days)
        //  583400891
    //    uint256 interestPerSecond = 58340089 * (tokenBalanceOf[msg.sender] / 1e16);
    //    uint256 interest = interestPerSecond * depositTime;
        console.log("Deposit Start:", depositStart[msg.sender]);
        console.log("Primary Deposit:", block.timestamp);

        if(depositStart[msg.sender] <= block.timestamp - 60){
            uint bigBonus = _amount + bonus;
        // Mint FarmToken to msg sender - Transfer Earned Tokens
        _mint(msg.sender, bigBonus);  // currently matching input vs output
        }
        /* else{
        _mint(msg.sender, _amount/10);
        } */
        // Transfer MyTokens from this smart contract to msg sender
        token.safeTransfer(msg.sender, _amount);
        tokenBalanceOf[msg.sender] = tokenBalanceOf[msg.sender] - _amount;
        //reset deposit time
        depositStart[msg.sender] = 0;
    }

    // work on a possible master withdraw with owner to save funds

}