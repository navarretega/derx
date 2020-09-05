// SPDX-License-Identifier: MIT

/*
    Fake YFI Stablecoin
    - We'll be using fake ERC20 tokens within our exchange
    - Since the real tokens are only accesible within the Main and some Test Networks, we're creating mock (fake) tokens so we can develop locally.
    - The Faucet is to get some tokens to test our Smart Contract
*/

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YFI is ERC20 {
    constructor() public ERC20("Yearn Finance", "YFI") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
