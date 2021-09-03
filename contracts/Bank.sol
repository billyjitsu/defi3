//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "./MommyToken.sol";



contract Bank {

    //assign the token contract to a variable
    MommyToken private momtoken;

    // Set Blockchain address to the blockchain
    //address public MTContract = 

    //MAPPINGS
    //Look at address to see balance
    mapping(address => uint) public tokenBalanceOf;
    //look at the start times
    mapping(address => uint) public depositStart;
    //check if address has a deposit
    mapping(address => bool) public isDeposited;

    //EVENTS
    event Deposit(address indexed user, uint tokenAmount, uint timeStart);
    event Withdraw(address indexed user, uint tokenAmmount, uint depositTime, uint interest);

    constructor(MommyToken _mommy) {
      //assign token deployed contract to variable
      momtoken = _mommy;
    }


    function deposit() public payable {
        //Can't deposit twice - need to fix
        require(isDeposited[msg.sender] == false, "Error deposit already active");
        require(msg.value > 0, "Error, must deposit some value");

        //core function of the deposit
        tokenBalanceOf[msg.sender] = tokenBalanceOf[msg.sender] + msg.value;
        //get a timestamp of the deposit time
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        //Set status to be true if deposited
        isDeposited[msg.sender] = true; // activate deposit status
        //emit an event that there is a deposit
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }


    function withdraw() public {
        require(isDeposited[msg.sender] == true, 'Error, no deposits');
        uint userBalance = tokenBalanceOf[msg.sender]; // variable for event

        //Check the users time saving
        uint depositTime = block.timestamp - depositStart[msg.sender];

        // work on this calculation for now 10%
        uint interestPerSecond = 31668017 * (tokenBalanceOf[msg.sender] / 1e16);
        uint interest = interestPerSecond * depositTime;

        //Send token back to user - basically withdraw all
        payable(msg.sender).transfer(tokenBalanceOf[msg.sender]);
        //Send earned farm token back  // side not fix this token not mom token
        momtoken.mint(msg.sender, interest);  // send the interest to user

        //reset depositor data
        tokenBalanceOf[msg.sender] = 0;

        //reset is deposited
        isDeposited[msg.sender] = false; // deactivate status
        // Taken All out
        tokenBalanceOf[msg.sender] = 0;
        // Reset interest timer
        depositStart[msg.sender] = 0;

        //emit event
        emit Withdraw(msg.sender, userBalance, depositTime, interest);
    }

    function borrow() public {

    }


}