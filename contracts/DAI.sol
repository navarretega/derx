// SPDX-License-Identifier: MIT

/*
    Fake DAI Stablecoin
    - We need a quote currency
      For example, EUR/USD = 1.5 where EUR is the base currency and USD is the quote currency, which means you need 1.5 USD for 1 EUR
      We could use ETH so that we have BNB/ETH but the problem is that ETH is very volatile, therefore we use DAI since it always keeps the same value. 1 DAI = 1 USD
    - DAI is only accesible within the Main and some Test Networks. Since we want to develop locally, we're creating mock (fake) DAI Stablecoin
    - The Faucet is to get some tokens to test our Smart Contract
*/

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
    constructor() public ERC20("Dai Stablecoin", "DAI") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
