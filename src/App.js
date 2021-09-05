import {useState } from 'react';
import { ethers } from 'ethers'
import './App.css';
import FarmToken from './artifacts/contracts/FarmToken.sol/FarmToken.json'
import MommyToken from './artifacts/contracts/MommyToken.sol/MommyToken.json'
import Navbar from './Navbar';
import Home from './Home';
import { connectWallet } from "./utils/interact.js";
import { useMomBalance } from "./utils/useMomBalance.js";

const momAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const farmAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

function App() {
  const [amount, amountValue] = useState(0)
  const [pullout, pulloutValue] = useState()
  const [walletAddress, setWallet] = useState(""); // additional stuff
  const [status, setStatus] = useState("");  // additional stuff
  
  const momBalance = useMomBalance();

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
      try {
        const data = await contract.balance()
        console.log('data: ', ethers.utils.formatEther(data))
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
      
    }    
  }

  async function withdraw () {
    await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      const transaction = await contract.withdraw(ethers.utils.parseEther(amount))
      await transaction.wait()
      balance()

  }

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };



  return (
    <div className="App">
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
        <p>
         <button onClick={balance}>Get Balance</button> 
        </p>
        <p>
         <button onClick={mommyBalance}>Get Mommy Balance</button> 
         <h1>MToken Balance {momBalance} </h1>
          
        </p>
        <p>
         <button onClick={approve}>Approve</button> 
        </p>

         <button onClick={deposit}>Deposit</button>
         <input
         onChange={e => amountValue(e.target.value)}
         placeHolder="Deposit Amount"
         ></input>
         <p></p>
         <button onClick={withdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default App;
