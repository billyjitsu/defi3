import {useState, useEffect } from 'react';
import { ethers } from 'ethers'
import FarmToken from './artifacts/contracts/FarmToken.sol/FarmToken.json'
import MommyToken from './artifacts/contracts/MommyToken.sol/MommyToken.json'
import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";



//const momAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//const farmAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

const momAddress = "0xab5104400eB6b7a7d54120ad05169a2eeFaDD33b"
const farmAddress = "0xa1F0d0867D27F4cbA61970C70799185EC400F4C6"

function App() {
  const [amount, amountValue] = useState(0)
  const [pullout, pulloutValue] = useState(0)
  const [walletAddress, setWallet] = useState(""); // additional stuff
  const [status, setStatus] = useState("");  // additional stuff
  const [tAmount, setTAmount] = useState("")
  const [oAmount, setOAmount] = useState(0)
  //interest amount
  const [iAmount, setIAmount] = useState(0)
  const [mAmount, setMAmount] = useState(0)
  const [time, setTime] = useState("")
  const [btime, setBtime] =  useState(0)
  
  

  /******** Time/ Date displays ******/
  //let stamp = Date.now()
  //console.log('stamp',stamp)
  //need it in milliseconds (add 3 zeros on top of Eth 18)
  let xtime = (time * 10 ** 21)
  let currentTimestamp = (xtime)
  let largeBonus = (xtime + 604800000) //add 3 zeros for milliseconds
  let smallBonus = (xtime + 86400000)
  let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(currentTimestamp)
  let lBonusDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(largeBonus)
  let sBonusDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(smallBonus)
  /**************************************************************/

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

  async function checkTime () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      try {
        const data = await contract.checkTime()
        console.log('data: ', ethers.utils.formatEther(data))
        setTime(ethers.utils.formatEther(data))
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
  }
/*
  async function rugPull () {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(farmAddress, FarmToken.abi, signer)
      const transaction = await contract.rugPull(ethers.utils.parseEther(pullout))
      await transaction.wait()
    }    

  }
*/

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
    checkTime()
    mommyBalance ()
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
        <h1>Billy Coin Inc</h1>
          <p>
             <h4>Total Value Locked {tAmount} </h4>
          </p>
          <p>
            <button onClick={approve}>Approve</button>  
            <h3 style = {{marginTop: -4}}>Must Approve Before Deposit (1st time only)
            </h3>
          </p>
          
          <h2 style = {{marginTop: 60}} >Available to Deposit {mAmount} </h2>
           <button style = {{marginTop: -10}} onClick={deposit}>Deposit</button>
            <input
               onChange={e => amountValue(e.target.value)}
               placeHolder="Deposit Amount"
             ></input>
             <p></p>
             <text >Deposit Date {date} </text>
              
         
        
         <h2 style = {{marginTop: 70}}>Your Deposited Balance {oAmount} </h2>
         <button style = {{marginTop: -10}} onClick={withdraw}>Withdraw</button>
         <input
             onChange={e => pulloutValue(e.target.value)}
             placeHolder="Withdraw Amount"
         ></input>      
         <p>
             <text>
                  For a $2 bonus withdraw after {sBonusDate} 
             </text>
             <p></p>
             <text>
                  For a double bonus withdraw after {lBonusDate}
             </text>
             
          </p>
         </div>
      </div>
    </div>
  );
}

export default App;
