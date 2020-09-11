const DAI = artifacts.require("DAI.sol");
const BNB = artifacts.require("BNB.sol");
const LINK = artifacts.require("LINK.sol");
const YFI = artifacts.require("YFI.sol");
const Dex = artifacts.require("Dex.sol");

module.exports = async function (deployer, network, accounts) {
  // Constants
  const daiSymbol = web3.utils.fromAscii("DAI");
  const bnbSymbol = web3.utils.fromAscii("BNB");
  const linkSymbol = web3.utils.fromAscii("LINK");
  const yfiSymbol = web3.utils.fromAscii("YFI");
  const daiAmount = web3.utils.toWei("5000"); // 5000 DAI from faucet to account
  const tokenAmount = web3.utils.toWei("3000"); // 3000 BNB/LINK/YFI from faucet to account
  const dexDaiAmount = web3.utils.toWei("2500"); // 2500 DAI from account to dex
  const dexTokenAmount = web3.utils.toWei("1500"); // 1500 BNB/LINK/YFI from account to dex
  const [trader1, trader2, _] = accounts;
  const buy = 0;
  const sell = 1;

  // Deploy Smart Contracts
  await deployer.deploy(DAI);
  await deployer.deploy(BNB);
  await deployer.deploy(LINK);
  await deployer.deploy(YFI);
  await deployer.deploy(Dex);

  // Get deployed instances
  const dai = await DAI.deployed();
  const bnb = await BNB.deployed();
  const link = await LINK.deployed();
  const yfi = await YFI.deployed();
  const dex = await Dex.deployed();

  // Add tokens to DEX
  await dex.addToken(daiSymbol, dai.address);
  await dex.addToken(bnbSymbol, bnb.address);
  await dex.addToken(linkSymbol, link.address);
  await dex.addToken(yfiSymbol, yfi.address);

  // Allocate Tokens to different accounts (Trader1 and Trader2)
  await dai.faucet(trader1, daiAmount);
  await dai.faucet(trader2, daiAmount);
  await bnb.faucet(trader1, tokenAmount);
  await bnb.faucet(trader2, tokenAmount);
  await link.faucet(trader1, tokenAmount);
  await link.faucet(trader2, tokenAmount);
  await yfi.faucet(trader1, tokenAmount);
  await yfi.faucet(trader2, tokenAmount);

  // Approve Tokens to be handled by DEX (Trader1/Trader2 are letting the DEX use its tokens)
  await dai.approve(dex.address, dexDaiAmount, { from: trader1 });
  await dai.approve(dex.address, dexDaiAmount, { from: trader2 });
  await bnb.approve(dex.address, dexTokenAmount, { from: trader1 });
  await bnb.approve(dex.address, dexTokenAmount, { from: trader2 });
  await link.approve(dex.address, dexTokenAmount, { from: trader1 });
  await link.approve(dex.address, dexTokenAmount, { from: trader2 });
  await yfi.approve(dex.address, dexTokenAmount, { from: trader1 });
  await yfi.approve(dex.address, dexTokenAmount, { from: trader2 });

  // Deposit tokens to DEX (From Trader1/Trader2 to DEX)
  await dex.deposit(daiSymbol, dexDaiAmount, { from: trader1 });
  await dex.deposit(daiSymbol, dexDaiAmount, { from: trader2 });
  await dex.deposit(bnbSymbol, dexTokenAmount, { from: trader1 });
  await dex.deposit(bnbSymbol, dexTokenAmount, { from: trader2 });
  await dex.deposit(linkSymbol, dexTokenAmount, { from: trader1 });
  await dex.deposit(linkSymbol, dexTokenAmount, { from: trader2 });
  await dex.deposit(yfiSymbol, dexTokenAmount, { from: trader1 });
  await dex.deposit(yfiSymbol, dexTokenAmount, { from: trader2 });

  // Utility function to increase time between orders created below
  const increaseTime = async (seconds) => {
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: 0,
      },
      () => {}
    );
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [],
        id: 0,
      },
      () => {}
    );
  };

  // Create Fake Sample Orders
  // Trade 1
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("10"), 10, buy, { from: trader1 });
  await dex.marketOrder(bnbSymbol, web3.utils.toWei("10"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 2
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("14"), 12, buy, { from: trader1 });
  await dex.marketOrder(bnbSymbol, web3.utils.toWei("14"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 3
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("5"), 10, sell, { from: trader1 });
  await dex.marketOrder(bnbSymbol, web3.utils.toWei("5"), buy, { from: trader2 });
  await increaseTime(2);
  // Trade 4
  await dex.limitOrder(linkSymbol, web3.utils.toWei("20"), 30, buy, { from: trader1 });
  await dex.marketOrder(linkSymbol, web3.utils.toWei("20"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 5
  await dex.limitOrder(linkSymbol, web3.utils.toWei("12"), 40, buy, { from: trader1 });
  await dex.marketOrder(linkSymbol, web3.utils.toWei("12"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 6
  await dex.limitOrder(linkSymbol, web3.utils.toWei("4"), 20, sell, { from: trader1 });
  await dex.marketOrder(linkSymbol, web3.utils.toWei("4"), buy, { from: trader2 });
  await increaseTime(2);
  // Trade 7
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("40"), 2, buy, { from: trader1 });
  await dex.marketOrder(yfiSymbol, web3.utils.toWei("40"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 8
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("50"), 4, buy, { from: trader1 });
  await dex.marketOrder(yfiSymbol, web3.utils.toWei("50"), sell, { from: trader2 });
  await increaseTime(2);
  // Trade 9
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("45"), 3, sell, { from: trader1 });
  await dex.marketOrder(yfiSymbol, web3.utils.toWei("45"), buy, { from: trader2 });
  await increaseTime(2);
  // Finally set some 'random' limit orders
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("25"), 5, buy, { from: trader2 });
  await increaseTime(1);
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("30"), 6, buy, { from: trader2 });
  await increaseTime(1);
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("30"), 8, sell, { from: trader2 });
  await increaseTime(2);
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("17"), 7, sell, { from: trader2 });
  await increaseTime(3);
  await dex.limitOrder(bnbSymbol, web3.utils.toWei("10"), 9, sell, { from: trader2 });
  await increaseTime(3);
  await dex.limitOrder(linkSymbol, web3.utils.toWei("23"), 7, buy, { from: trader1 });
  await increaseTime(2);
  await dex.limitOrder(linkSymbol, web3.utils.toWei("12"), 4, sell, { from: trader2 });
  await increaseTime(1);
  await dex.limitOrder(linkSymbol, web3.utils.toWei("23"), 10, sell, { from: trader1 });
  await increaseTime(1);
  await dex.limitOrder(linkSymbol, web3.utils.toWei("7"), 7, buy, { from: trader2 });
  await increaseTime(1);
  await dex.limitOrder(linkSymbol, web3.utils.toWei("11"), 9, sell, { from: trader1 });
  await increaseTime(2);
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("14"), 12, sell, { from: trader2 });
  await increaseTime(3);
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("12"), 14, buy, { from: trader1 });
  await increaseTime(2);
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("20"), 15, sell, { from: trader2 });
  await increaseTime(3);
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("19"), 15, buy, { from: trader1 });
  await increaseTime(3);
  await dex.limitOrder(yfiSymbol, web3.utils.toWei("10"), 15, sell, { from: trader2 });
  await increaseTime(1);
};
