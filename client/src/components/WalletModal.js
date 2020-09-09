import React, { useRef, useEffect, useState } from "react";

function WalletModal({ setShowWalletModal, walletDef }) {
  const { action, token, func } = walletDef;
  const [amount, setAmount] = useState(0);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      setShowWalletModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div
        ref={myRef}
        className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6"
        role="dialog"
      >
        <div>
          {action === "Deposit" ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
            </div>
          )}
          <div className="mt-3 text-center sm:mt-5">
            <div className="mt-2">
              <div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="price"
                    className="form-input block w-full pr-12 sm:text-sm sm:leading-5"
                    placeholder="0.00"
                    aria-describedby="price-currency"
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm sm:leading-5" id="price-currency">
                      {token}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <span className="flex w-full rounded-md shadow-sm">
            <button
              onClick={() => func(amount, token)}
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-gray-800 text-base leading-6 font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              {action}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default WalletModal;
