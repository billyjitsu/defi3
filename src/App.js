import {useState, useEffect } from 'react';
import { ethers } from 'ethers'
import './App.css';
import FarmToken from './artifacts/contracts/FarmToken.sol/FarmToken.json'
import MommyToken from './artifacts/contracts/MommyToken.sol/MommyToken.json'
import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";
//import { useMomBalance } from "./utils/useMomBalance.js";

const momAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const farmAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

function App() {
  const [amount, amountValue] = useState(0)
  const [pullout, pulloutValue] = useState(0)
  const [walletAddress, setWallet] = useState(""); // additional stuff
  const [status, setStatus] = useState("");  // additional stuff
  const [tAmount, setTAmount] = useState("")
  const [oAmount, setOAmount] = useState(0)
  const [iAmount, setIAmount] = useState(0)
  const [mAmount, setMAmount] = useState(0)
  

  // play with this - request for meta?
  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log("error");
      console.error(error);
  
      alert("Login to Metamask first");
    }
  }

  async function mommyBalance () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(momAddress, MommyToken.abi, signer)
      try {
        const data = await contract.balanceOf(signer.getAddress(this))
        console.log('data: ', ethers.utils.formatEther(data))
        setMAmount(ethers.utils.formatEther(data))
      } catch (err) {
        console.log("Error: ", err)
        console.log(signer.getAddress(this))
      }
    }    
  } 

  async function balance () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, provider)
      const signer = provider.getSigner()
      try {
        const data = await contract.balance()
        console.log('data: ', ethers.utils.formatEther(data))
        setTAmount(ethers.utils.formatEther(data))
      } catch (err) {
        console.log("Error: ", err)
      }
    }    

  }

  async function ownerDepositBalance () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      //const contract = new ethers.Contract(farmAddress, FarmToken.abi, provider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      try {
        const data = await contract.ownerDepositBalance()
        console.log('data: ', ethers.utils.formatEther(data))
        setOAmount(ethers.utils.formatEther(data))
      } catch (err) {
        console.log("Error: ", err)
      }
    }    

  }

  async function ownerInterestBalance () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      //const contract = new ethers.Contract(farmAddress, FarmToken.abi, provider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      try {
        const data = await contract.ownerInterestBalance()
        console.log('data: ', ethers.utils.formatEther(data))
        setIAmount(ethers.utils.formatEther(data))
      } catch (err) {
        console.log("Error: ", err)
      }
    }    

  }

  async function approve () {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const mcontract = new ethers.Contract(momAddress, MommyToken.abi, signer)
      await mcontract.approve(farmAddress, ethers.utils.parseEther("200000"))
      
    }    
  }

  async function deposit () {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      const transaction = await contract.deposit(ethers.utils.parseEther(amount))
      await transaction.wait()
      balance()
      ownerDepositBalance ()
      ownerInterestBalance ()
    }    
  }

  async function withdraw () {
    await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      const transaction = await contract.withdraw(ethers.utils.parseEther(pullout))
      await transaction.wait()
      balance()
      ownerDepositBalance ()
      ownerInterestBalance ()

  }

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }


  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status); 
    addWalletListener();
    balance()
    ownerDepositBalance ()
    ownerInterestBalance ()
    mommyBalance ()
    console.log('useEffect Ran')
   }, [tAmount, oAmount]);

  return (
    
    
    <div className="App">
      <div id="container">
        <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
     
      <div className="content">
        <h1>Invest your Money</h1>
          <p>
             <h2>Total Value Locked {tAmount} </h2>
          </p>
          
          <p>
            <button onClick={approve}>Approve</button> 
            <h3>Must Approve Before Deposit (1st time only)</h3>
          </p>
          
          <h2>Available to Deposit {mAmount} </h2>
           <button onClick={deposit}>Deposit</button>
            <input
               onChange={e => amountValue(e.target.value)}
               placeHolder="Deposit Amount"
             ></input>
         <p></p>
         <h2>Interest Earned Balance {iAmount} </h2>
         <h2>Your Deposited Balance {oAmount} </h2>
         <button onClick={withdraw}>Withdraw</button>
         <input
             onChange={e => pulloutValue(e.target.value)}
             placeHolder="Withdraw Amount"
         ></input>
         </div>
      </div>
    </div>
  );
}

export default App;
