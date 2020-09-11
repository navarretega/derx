import React, { useState, useContext } from "react";

import EthContext from "../EthContext";
import Notification from "./Notification";

function Orders({ type, activeToken }) {
  const [marketType, setMarketType] = useState("limit");
  const [amount, setAmount] = useState("0");
  const [price, setPrice] = useState("0");
  const [showNotification, setShowNotification] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const eth = useContext(EthContext);
  const contracts = eth["contracts"];
  const dex = contracts["dex"];
  const accountAddress = eth["accounts"][0];
  const web3 = eth["web3"];
  const side = type === "BUY" ? 0 : 1;

  async function order() {
    const symbol = web3.utils.fromAscii(activeToken);
    const weiAmount = web3.utils.toWei(amount, "ether");
    try {
      if (marketType === "limit") {
        console.log(`Making a ${type} Limit Order for ${amount} ${activeToken} at ${price} DAI`);
        await dex.methods.limitOrder(symbol, weiAmount, price, side).send({ from: accountAddress });
      } else if (marketType === "market") {
        console.log(`Making a ${type} Market Order for ${amount} ${activeToken}`);
        await dex.methods.marketOrder(symbol, weiAmount, side).send({ from: accountAddress });
      }
      // Reload page - Not ideal but works for the purpose of this demo
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
      {showNotification && <Notification setShowNotification={setShowNotification} showErr={showErr} />}

      <div className="bg-gray-100 text-center px-4 py-5 sm:px-6 tracking-wider">
        {type} {activeToken}
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div>
          <label htmlFor="order" className="block text-sm leading-5 font-medium text-gray-700">
            Order Type
          </label>
          <select
            id="order"
            className="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            onChange={(event) => setMarketType(event.target.value)}
          >
            <option value="limit">Limit Order</option>
            <option value="market">Market Order</option>
          </select>
        </div>
        <div className="mt-2">
          <label htmlFor={`orderAmount-${type}`} className="block text-sm font-medium leading-5 text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id={`orderAmount-${type}`}
              className="form-input block w-full pr-12 sm:text-sm sm:leading-5"
              value={amount}
              aria-describedby="price-currency"
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5" id="price-currency">
                {activeToken}
              </span>
            </div>
          </div>
        </div>
        <div className={`${marketType === "market" ? "invisible" : ""} mt-2`}>
          <label htmlFor={`orderPrice-${type}`} className="block text-sm font-medium leading-5 text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id={`orderPrice-${type}`}
              className="form-input block w-full pr-12 sm:text-sm sm:leading-5"
              value={price}
              aria-describedby="price-currency"
              onChange={(event) => setPrice(event.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5" id="price-currency">
                DAI
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <span className="flex w-full rounded-md shadow-sm">
            {type === "BUY" ? (
              <button
                onClick={order}
                type="button"
                className="inline-flex w-full justify-center items-center px-3 py-2 text-gray-900 border border-transparent text-sm leading-4 font-medium rounded-md bg-green-300 hover:bg-green-400 focus:outline-none focus:border-green-300 focus:shadow-outline-gray active:bg-green-700 transition ease-in-out duration-150"
              >
                Buy
                <svg
                  className="ml-2 -mr-0.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={order}
                className="inline-flex w-full justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-900 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:border-gray-400 focus:shadow-outline-gray active:bg-gray-400 transition ease-in-out duration-150"
              >
                <svg
                  className="mr-2 -ml-0.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Sell
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Orders;
