import * as React from "react";
import { ethers } from "ethers"; //library for discuss with the contract
import './App.css';
import { useEffect, useState } from "react";
import abi from "./utils/WavePortal.json"

export default function App() {
  //variable for save current user account
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0xBC7878eB76d273E9Ef1782F4d40F37f342E66473";
  const contractABI = abi.abi; //recover all param from json file

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      //ask metamask if eth account exist
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum){
        alert("Get Metamask");
        return;
      }

      //ask metamask to connect
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (err){
      console.log(err);
    }
  }

  //run function load page
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = async () => {
    try {
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        //call wave method - write in the blockchain
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash); //for find transaction with the hash on etherscan

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        
        //read new value
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey! 👋
        </div>

        <div className="bio">
        Web App on web 3 made with react + solidity
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {/* if no current wallet connect */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
