import * as React from "react";
import { ethers } from "ethers"; //library for discuss with the contract
import './App.css';
import { useEffect, useState } from "react";
import abi from "./utils/WavePortal.json"

export default function App() {
  //variable for save current user account
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x5840a2cB3aBc6bbb241af69a2De685eA21e4922B";
  const contractABI = abi.abi; //recover all param from json file
  const [allWaves, setAllWaves] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        //call method contract allWaves
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        //store new value
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum Object doesn't exist!")
      }
    } catch (err) {
      console.log(err);
    }
  }


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
    const onLoad = async () => {
      await checkIfWalletIsConnected();
      await getAllWaves();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [getAllWaves])

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
        const waveTxn = await wavePortalContract.wave(inputValue ?? "Oups");
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

  const onInputChange = (event) => {
    // recover value inside input and call useEffect
    const { value }= event.target;
    setInputValue(value);
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
        <div className="input-container"> 
        <form
            onSubmit={(event) => {
              event.preventDefault();
              console.log("value", inputValue);
              wave()
            }}
          >
            <input type="text" placeholder="Enter yout Wave" value={inputValue} onChange={onInputChange}/>
            <button type="submit" className="waveButton">Wave at Me</button>
          </form>
          </div>
        {/* if no current wallet connect */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Address: {wave.timestamp.toString()}</div>
              <div>Address: {wave.message}</div>
              </div>
          )
        })}
      </div>
    </div>
  );
}
