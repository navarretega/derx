import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import EthContext from "../EthContext";

function AllTrades({ trades, activeToken }) {
  const eth = useContext(EthContext);
  const web3 = eth["web3"];

  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
      <div className="bg-gray-100 text-center px-4 py-5 sm:px-6 tracking-wider">MOST RECENT TRADES</div>
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
                        Amount ({activeToken})
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trades.slice(0, 10).map((trade) => (
                      <tr key={trade.tradeId}>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">{trade.price}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-500">
                          {web3.utils.fromWei(trade.amount, "ether")}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {moment(parseInt(trade.date) * 1000).fromNow()}
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

export default AllTrades;
