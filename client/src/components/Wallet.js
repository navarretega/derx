import React, { useContext, useEffect, useState } from "react";

import EthContext from "../EthContext";
import Notification from "./Notification";

function Wallet({ activeToken, setShowWalletModal, setWalletDef }) {
  const [daiTokenBalance, setDaiTokenBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [getBalance, setGetBalance] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const eth = useContext(EthContext);
  const contracts = eth["contracts"];
  const dex = contracts["dex"];
  const accountAddress = eth["accounts"][0];
  const web3 = eth["web3"];

  async function deposit(amount, token) {
    try {
      const symbol = web3.utils.fromAscii(token);
      const weiAmount = web3.utils.toWei(amount, "ether");
      await contracts[token].methods.approve(dex._address, weiAmount).send({ from: accountAddress });
      await dex.methods.deposit(symbol, weiAmount).send({ from: accountAddress });
      setShowWalletModal(false);
      setGetBalance(true);
      setShowErr(false);
      setShowNotification(true);
    } catch (error) {
      setShowWalletModal(false);
      setShowErr(true);
      setShowNotification(true);
    }
  }

  async function withdraw(amount, token) {
    try {
      const symbol = web3.utils.fromAscii(token);
      const weiAmount = web3.utils.toWei(amount, "ether");
      await dex.methods.withdraw(symbol, weiAmount).send({ from: accountAddress });
      setShowWalletModal(false);
      setGetBalance(true);
      setShowErr(false);
      setShowNotification(true);
    } catch (error) {
      setShowWalletModal(false);
      setShowErr(true);
      setShowNotification(true);
    }
  }

  useEffect(() => {
    async function init() {
      if (!activeToken) return;
      const symbol = web3.utils.fromAscii(activeToken);
      const daiSymbol = web3.utils.fromAscii("DAI");
      const balance = await dex.methods.balances(accountAddress, symbol).call();
      const daiBalance = await dex.methods.balances(accountAddress, daiSymbol).call();
      const _tokenBalance = web3.utils.fromWei(balance, "ether");
      const _daiTokenBalance = web3.utils.fromWei(daiBalance, "ether");
      setGetBalance(false);
      setTokenBalance(_tokenBalance);
      setDaiTokenBalance(_daiTokenBalance);
    }
    init();
  }, [web3, dex, accountAddress, activeToken, getBalance]);

  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg h-full">
      {showNotification && <Notification setShowNotification={setShowNotification} showErr={showErr} />}
      <div className="bg-gray-100 text-center px-4 py-5 sm:px-6 tracking-wider">WALLET</div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-around items-center">
          <div>
            <h4 className="text-xl">
              {daiTokenBalance} <span className="text-xs text-green-900">DAI</span>
            </h4>
          </div>
          <div>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
              <button
                onClick={() => {
                  setWalletDef({ action: "Deposit", token: "DAI", func: deposit });
                  setShowWalletModal(true);
                }}
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
                onClick={() => {
                  setWalletDef({ action: "Withdraw", token: "DAI", func: withdraw });
                  setShowWalletModal(true);
                }}
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
        <div className="flex justify-around items-center">
          <div>
            <h4 className="text-xl">
              {tokenBalance} <span className="text-xs text-green-900">{activeToken}</span>
            </h4>
          </div>
          <div>
            <span className="relative z-0 inline-flex shadow-sm rounded-md">
              <button
                onClick={() => {
                  setWalletDef({ action: "Deposit", token: activeToken, func: deposit });
                  setShowWalletModal(true);
                }}
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
                onClick={() => {
                  setWalletDef({ action: "Withdraw", token: activeToken, func: withdraw });
                  setShowWalletModal(true);
                }}
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
