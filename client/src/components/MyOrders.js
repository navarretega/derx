import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import EthContext from "../EthContext";

function MyOrders({ activeToken }) {
  const [myOrders, setMyOrders] = useState([]);
  const eth = useContext(EthContext);
  const contracts = eth["contracts"];
  const dex = contracts["dex"];
  const accountAddress = eth["accounts"][0];
  const web3 = eth["web3"];

  useEffect(() => {
    async function init() {
      if (!activeToken) return;
      const symbol = web3.utils.fromAscii(activeToken);
      const _buyOrders = await dex.methods.getOrders(symbol, 0).call({ from: accountAddress });
      const _sellOrders = await dex.methods.getOrders(symbol, 1).call({ from: accountAddress });
      const myOrders = [];
      for (const _buyOrder of _buyOrders) {
        if (_buyOrder["trader"].toLowerCase() === accountAddress.toLowerCase()) {
          myOrders.push(_buyOrder);
        }
      }
      for (const _sellOrder of _sellOrders) {
        if (_sellOrder["trader"].toLowerCase() === accountAddress.toLowerCase()) {
          myOrders.push(_sellOrder);
        }
      }
      setMyOrders(myOrders);
    }
    init();
  }, [activeToken]);

  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
      <div className="bg-gray-100 text-center px-4 py-5 sm:px-6 tracking-wider">MY CURRENT ORDERS</div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Price (DAI)
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Amount/Filled ({activeToken})
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Side
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">{order.price}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-500">
                          {web3.utils.fromWei(order.amount, "ether")} / {web3.utils.fromWei(order.filled, "ether")}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {order.operation === "0" ? "BUY" : "SELL"}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {moment(parseInt(order.date) * 1000).fromNow()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
