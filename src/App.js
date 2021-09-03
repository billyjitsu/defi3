import {useState } from 'react';
import { ethers } from 'ethers'
import './App.css';
import Bank from './artifacts/contracts/Bank.sol/Bank.json'
import FarmToken from './artifacts/contracts/FarmToken.sol/FarmToken.json'
import Navbar from './Navbar';
import Home from './Home';
import { connectWallet } from "./utils/interact.js";

const farmAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

function App() {
  const [amount, amountValue] = useState(0)
  const [pullout, pulloutValue] = useState()
  const [walletAddress, setWallet] = useState(""); // additional stuff
  const [status, setStatus] = useState("");  // additional stuff

  // play with this - request for meta?
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function balance () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, provider)
      try {
        const data = await contract.balance()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    

  }

  async function deposit () {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      const transaction = await contract.deposit(amount)
      await transaction.wait()
      balance()
      
    }    
  }

  async function withdraw () {

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

         <button onClick={deposit}>Deposit</button>
         <input
         onChange={e => amountValue(e.target.value)}
         placeHolder="Deposit Amount"
         ></input>
         
         <p>
         <button onClick={requestAccount}>Request Account Test</button>
         </p>
         
      </div>
    </div>
  );
}

export default App;
