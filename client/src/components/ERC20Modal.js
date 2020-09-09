import React, { useRef, useEffect, useContext, useState } from "react";

import EthContext from "../EthContext";
import Loading from "./Loading";

function ERC20Modal({ setShowERCModal, tokens }) {
  const eth = useContext(EthContext);
  const [balances, setBalances] = useState([]);
  const contracts = eth["contracts"];
  const accountAddress = eth["accounts"][0];
  const web3 = eth["web3"];
  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      setShowERCModal(false);
    }
  };

  useEffect(() => {
    async function init() {
      const tokenBalances = [];
      const daiBalance = await contracts["DAI"].methods.balanceOf(accountAddress).call();
      const daiTokenBalance = web3.utils.fromWei(daiBalance, "ether");
      tokenBalances.push({ token: "DAI", tokenBalance: daiTokenBalance });
      for (const token of tokens) {
        const balance = await contracts[token].methods.balanceOf(accountAddress).call();
        const tokenBalance = web3.utils.fromWei(balance, "ether");
        tokenBalances.push({ token: token, tokenBalance: tokenBalance });
      }
      setBalances(tokenBalances);
    }
    init();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div
          ref={myRef}
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              {/* <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg> */}
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                ></path>
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Your Metamask Wallet
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-500">
                  Here you can see all of your ERC20 token balance which hasn't been added to DERX.
                </p>
              </div>
            </div>

            {balances.length > 0 ? (
              <div className="flex flex-col mt-5">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 bg-gray-50 text-center text-xs leading-4 font-base text-gray-500 uppercase tracking-wider">
                              Token
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-center text-xs leading-4 font-base text-gray-500 uppercase tracking-wider">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {balances.map((balance, idx) => (
                            <tr key={idx} className="bg-white">
                              <td className="px-4 py-2 whitespace-no-wrap text-center text-sm leading-5 font-medium text-gray-900">
                                {balance["token"]}
                              </td>
                              <td className="px-4 py-2 whitespace-no-wrap text-center text-sm leading-5 text-gray-500">
                                {balance["tokenBalance"]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-7">
                <Loading />
              </div>
            )}
          </div>

          <div className="mt-5 sm:mt-6">
            <span className="flex w-full rounded-md shadow-sm">
              <button
                onClick={() => setShowERCModal(false)}
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-gray-800 text-base leading-6 font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Go back to dashboard
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ERC20Modal;
