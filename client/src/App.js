import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import Dex from "./contracts/Dex.json";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Dex.networks[networkId];
        const dex = new web3.eth.Contract(Dex.abi, deployedNetwork && deployedNetwork.address);
        const tokens = await dex.methods.getTokens().call();
        setAccounts(accounts);
        setTokens(tokens);
      } catch (err) {
        alert(err);
      }
    };
    init();
  }, []);

  if (accounts.length === 0 || tokens.length === 0) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Account: {accounts[0]}</h1>
      <h1>DEX Tokens:</h1>
      {tokens.map((token, idx) => (
        <h2 key={idx}>{token["symbol"]}</h2>
      ))}
    </div>
  );
}

export default App;
