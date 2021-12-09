import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  //address contract => 0xFe1E2790398239438AB06F78336C34C26eD6Fd1f

  const wave = () => {
    
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
      </div>
    </div>
  );
}
