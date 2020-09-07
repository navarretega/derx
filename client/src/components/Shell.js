import React, { useContext, useState } from "react";

import EthContext from "../EthContext";

function Shell() {
  const [showMenu, setShowMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const eth = useContext(EthContext);
  const dexAddress = eth["contracts"]["dex"]._address;
  const accountAddress = eth["accounts"][0];

  return (
    <div>
      <div className="bg-gray-800 pb-32">
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="border-b border-gray-700">
              <div className="flex items-center justify-between h-16 px-4 sm:px-0">
                <div className="flex items-center">
                  <div className="hidden md:block">
                    <div className="flex items-baseline space-x-4">
                      <p className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">
                        DERX | {dexAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                      aria-label="Notifications"
                    >
                      <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </button>

                    <div className="ml-3 relative">
                      <div>
                        <button
                          onClick={() => setShowAccount(!showAccount)}
                          className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                          id="user-menu"
                          aria-label="User menu"
                          aria-haspopup="true"
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-400 text-gray-700 flex items-center justify-center font-bold">A</div>
                        </button>
                      </div>

                      {showAccount && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                          <div className="py-1 rounded-md bg-white shadow-xs">
                            <p className="block px-4 py-1 text-sm text-gray-700">Your Account</p>
                            <p
                              className="block px-4 py-1 text-xs text-gray-700 hover:bg-gray-100"
                              style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            >
                              {accountAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                  >
                    {showMenu ? (
                      <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showMenu && (
            <div className="border-b border-gray-700">
              <div className="px-2 py-3 space-y-1 sm:px-3">
                <p
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
                  style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  DERX
                  <br />
                  <span className="text-xs" style={{ width: "70%" }}>
                    {dexAddress}
                  </span>
                </p>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5 space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-400 text-gray-700 flex items-center justify-center font-bold">A</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-medium leading-none text-white">Account</div>
                    <div
                      className="text-xs font-medium leading-none text-gray-400"
                      style={{ width: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {accountAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl leading-9 font-bold text-white">Dashboard</h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Shell;
