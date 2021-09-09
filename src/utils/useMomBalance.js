import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers'
import FarmToken from '../artifacts/contracts/FarmToken.sol/FarmToken.json'
// Other imports...

export function useMomBalance() {
  const [mbalance, setmBalance] = useState(0);
  const farmy = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const fetchBalance = useCallback(async () => {
    const address = await signer.getAddress();
    console.log(address);

    const contract = new ethers.Contract(farmy, FarmToken.abi, provider)
    const rawBalance = await contract.balance()
    //const rawBalance = await provider.getBalance(farmy);
    //const value = parseFloat(ethers.utils.formatEther(rawBalance));
    const value = parseFloat(ethers.utils.formatEther(rawBalance));
    setmBalance(value);
  }, []);

  useEffect(() => {
   fetchBalance()
  }, [fetchBalance]);

  return mbalance;
}

export default useMomBalance;