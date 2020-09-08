import React, { useContext, useEffect, useState } from "react";

import EthContext from "../EthContext";

function Wallet({ activeToken }) {
  const [daiTokenBalance, setDaiTokenBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const eth = useContext(EthContext);
  const dex = eth["contracts"]["dex"];
  const accountAddress = eth["accounts"][0];
  const web3 = eth["web3"];

  async function getBalance() {
    const symbol = web3.utils.fromAscii(activeToken);
    const daiSymbol = web3.utils.fromAscii("DAI");
    const balance = await dex.methods.balances(accountAddress, symbol).call();
    const daiBalance = await dex.methods.balances(accountAddress, daiSymbol).call();
    const tokenBalance = web3.utils.fromWei(balance, "ether");
    const daiTokenBalance = web3.utils.fromWei(daiBalance, "ether");
    setTokenBalance(tokenBalance);
    setDaiTokenBalance(daiTokenBalance);
  }

  useEffect(() => {
    getBalance();
  }, [activeToken]);

  return (
    <div className="bg-gray-100 overflow-hidden shadow rounded-lg">
      <div className="text-center px-4 py-5 sm:px-6 tracking-wider">WALLET</div>
      <div className="bg-gray-50 px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl">
              {daiTokenBalance} <span className="text-xs text-green-900">DAI</span>
            </h4>
          </div>
          <div>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-1 rounded-l-md border bg-green-300 text-sm leading-5 font-medium text-gray-900 hover:bg-green-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                Deposit
              </button>
              <button
                type="button"
                className="-ml-px relative inline-flex items-center px-4 py-1 rounded-r-md border bg-gray-300 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                Withdraw
              </button>
            </span>
          </div>
        </div>
        <div className="my-8"></div>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl">
              {tokenBalance} <span className="text-xs text-green-900">{activeToken}</span>
            </h4>
          </div>
          <div>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-1 rounded-l-md border bg-green-300 text-sm leading-5 font-medium text-gray-900 hover:bg-green-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                Deposit
              </button>
              <button
                type="button"
                className="-ml-px relative inline-flex items-center px-4 py-1 rounded-r-md border bg-gray-300 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                Withdraw
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
