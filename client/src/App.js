import React, { useEffect, useState } from "react";

import EthContext from "./EthContext";
import getWeb3 from "./getWeb3";
import Dex from "./contracts/Dex.json";
import ERC20 from "./contracts/ERC20.json";
import Loading from "./components/Loading";
import Shell from "./components/Shell";

function App() {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        // DEX
        const deployedNetwork = Dex.networks[networkId];
        const dex = new web3.eth.Contract(Dex.abi, deployedNetwork && deployedNetwork.address);
        const tokens = await dex.methods.getTokens().call();

        // ERC20 Tokens
        const tokenContracts = {};
        for (const token of tokens) {
          tokenContracts[web3.utils.hexToUtf8(token["symbol"])] = new web3.eth.Contract(ERC20.abi, token["tokenAddress"]);
        }

        setWeb3(web3);
        setAccounts(accounts);
        setContracts({ dex, ...tokenContracts });
      } catch (err) {
        alert(err);
      }
    };
    init();
  }, []);

  if (typeof web3 === "undefined" || accounts.length === 0 || typeof contracts === "undefined") {
    return <Loading full />;
  }

  return (
    <EthContext.Provider value={{ web3, accounts, contracts }}>
      <Shell />
    </EthContext.Provider>
  );
}

export default App;
