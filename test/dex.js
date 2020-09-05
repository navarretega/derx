const DAI = artifacts.require("DAI.sol");
const BNB = artifacts.require("BNB.sol");
const LINK = artifacts.require("LINK.sol");
const YFI = artifacts.require("YFI.sol");
const Dex = artifacts.require("Dex.sol");
const { expectRevert } = require("@openzeppelin/test-helpers");

function toWei(n) {
  return web3.utils.toWei(n, "ether");
}

function fromWei(n) {
  return web3.utils.fromWei(n, "ether");
}

contract("Dex", ([owner, trader1, trader2]) => {
  let dex, dai, bnb, link, yfi;

  beforeEach(async () => {
    // Deploy Smart Contracts - DEX and ERC20 Tokens
    dex = await Dex.new();
    dai = await DAI.new();
    bnb = await BNB.new();
    link = await LINK.new();
    yfi = await YFI.new();

    // Add Tokens to DEX
    await dex.addToken(web3.utils.fromAscii("DAI"), dai.address);
    await dex.addToken(web3.utils.fromAscii("BNB"), bnb.address);
    await dex.addToken(web3.utils.fromAscii("LINK"), link.address);
    await dex.addToken(web3.utils.fromAscii("YFI"), yfi.address);

    // Initial Number of Tokens
    const amount = toWei("10000");

    // Allocate Tokens to Addressess (Trader1 and Trader2)
    await dai.faucet(trader1, amount);
    await dai.faucet(trader2, amount);
    await bnb.faucet(trader1, amount);
    await bnb.faucet(trader2, amount);
    await link.faucet(trader1, amount);
    await link.faucet(trader2, amount);
    await yfi.faucet(trader1, amount);
    await yfi.faucet(trader2, amount);

    // Approve Tokens to be handled by DEX (Trader1/Trader2 are letting the DEX use its tokens)
    await dai.approve(dex.address, amount, { from: trader1 });
    await dai.approve(dex.address, amount, { from: trader2 });
    await bnb.approve(dex.address, amount, { from: trader1 });
    await bnb.approve(dex.address, amount, { from: trader2 });
    await link.approve(dex.address, amount, { from: trader1 });
    await link.approve(dex.address, amount, { from: trader2 });
    await yfi.approve(dex.address, amount, { from: trader1 });
    await yfi.approve(dex.address, amount, { from: trader2 });
  });

  describe("BeforeEach Setup", async () => {
    it("ERC20 Tokens have addresses", async () => {
      assert(dai.address !== null);
      assert(bnb.address !== null);
      assert(link.address !== null);
      assert(yfi.address !== null);
    });
    it("DEX has ERC20 Tokens", async () => {
      tokens = await dex.getTokens();
      assert.equal(tokens.length, 4);
    });
    it("Trader1 has Tokens", async () => {
      const daiBalance = await dai.balanceOf(trader1);
      const bnbBalance = await dai.balanceOf(trader1);
      const linkBalance = await dai.balanceOf(trader1);
      const yfiBalance = await dai.balanceOf(trader1);
      assert.equal(daiBalance.toString(), toWei("10000"));
      assert.equal(bnbBalance.toString(), toWei("10000"));
      assert.equal(linkBalance.toString(), toWei("10000"));
      assert.equal(yfiBalance.toString(), toWei("10000"));
    });
    it("Trader2 has Tokens", async () => {
      const daiBalance = await dai.balanceOf(trader2);
      const bnbBalance = await dai.balanceOf(trader2);
      const linkBalance = await dai.balanceOf(trader2);
      const yfiBalance = await dai.balanceOf(trader2);
      assert.equal(daiBalance.toString(), toWei("10000"));
      assert.equal(bnbBalance.toString(), toWei("10000"));
      assert.equal(linkBalance.toString(), toWei("10000"));
      assert.equal(yfiBalance.toString(), toWei("10000"));
    });
    it("Trader1 has approved DEX", async () => {
      const daiAllowed = await dai.allowance(trader1, dex.address);
      const bnbAllowed = await bnb.allowance(trader1, dex.address);
      const linkAllowed = await link.allowance(trader1, dex.address);
      const yfiAllowed = await yfi.allowance(trader1, dex.address);
      assert.equal(daiAllowed.toString(), toWei("10000"));
      assert.equal(bnbAllowed.toString(), toWei("10000"));
      assert.equal(linkAllowed.toString(), toWei("10000"));
      assert.equal(yfiAllowed.toString(), toWei("10000"));
    });
    it("Trader2 has approved DEX", async () => {
      const daiAllowed = await dai.allowance(trader2, dex.address);
      const bnbAllowed = await bnb.allowance(trader2, dex.address);
      const linkAllowed = await link.allowance(trader2, dex.address);
      const yfiAllowed = await yfi.allowance(trader2, dex.address);
      assert.equal(daiAllowed.toString(), toWei("10000"));
      assert.equal(bnbAllowed.toString(), toWei("10000"));
      assert.equal(linkAllowed.toString(), toWei("10000"));
      assert.equal(yfiAllowed.toString(), toWei("10000"));
    });
  });

  describe("Descentralized Exchange", async () => {
    it("Should deposit tokens", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("DAI");
      await dex.deposit(symbol, amount, { from: trader1 });
      const dexBalance = await dex.balances(trader1, symbol);
      assert(amount, dexBalance.toString());
    });
    it("Should not deposit tokens if token does not exist", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("BAT");
      await expectRevert(dex.deposit(symbol, amount, { from: trader1 }), "Token does not exist");
    });
    it("Should not deposit tokens if token balance is less than amount", async () => {
      const amount = toWei("100000");
      const symbol = web3.utils.fromAscii("DAI");
      await expectRevert(dex.deposit(symbol, amount, { from: trader1 }), "ERC20: transfer amount exceeds balance");
    });
    it("Should withdraw tokens", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("DAI");
      await dex.deposit(symbol, amount, { from: trader1 });
      await dex.widthraw(symbol, amount, { from: trader1 });
      const daiBalance = await dai.balanceOf(trader1);
      const dexBalance = await dex.balances(trader1, symbol);
      assert.equal(daiBalance.toString(), amount);
      assert.equal(dexBalance, 0);
    });
    it("Should not withdraw tokens if token does not exist", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("BAT");
      await expectRevert(dex.widthraw(symbol, amount, { from: trader1 }), "Token does not exist");
    });
    it("Should not withdraw tokens if dex balance is less than amount", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("DAI");
      await expectRevert(dex.widthraw(symbol, amount, { from: trader1 }), "Not enough tokens");
    });
    it("Should create limit order", async () => {
      const depositAmount = toWei("10000");
      const symbolDAI = web3.utils.fromAscii("DAI");
      const symbolBNB = web3.utils.fromAscii("BNB");
      const orderAmount = toWei("100");
      const price = 100;
      const buy = 0;
      const sell = 1;
      await dex.deposit(symbolDAI, depositAmount, { from: trader1 });
      await dex.limitOrder(symbolBNB, orderAmount, price, buy, { from: trader1 });
      const buyOrders = await dex.getOrders(symbolBNB, buy);
      const sellOrders = await dex.getOrders(symbolBNB, sell);
      assert.equal(buyOrders.length, 1);
      assert.equal(buyOrders[0]["id"], 0);
      assert.equal(buyOrders[0]["operation"], buy);
      assert.equal(buyOrders[0]["trader"], trader1);
      assert.equal(buyOrders[0]["symbol"], web3.utils.padRight(symbolBNB, 64));
      assert.equal(buyOrders[0]["price"], price);
      assert.equal(buyOrders[0]["amount"], orderAmount);
      assert.equal(buyOrders[0]["filled"], 0);
      assert.equal(sellOrders.length, 0);
    });
    it("Should create limit order at correct place", async () => {
      const depositAmount = toWei("10000");
      const symbolDAI = web3.utils.fromAscii("DAI");
      const symbolBNB = web3.utils.fromAscii("BNB");
      const orderAmount = toWei("10");
      const price1 = 50;
      const price2 = 70;
      const price3 = 60;
      const price4 = 40;
      const price5 = 80;
      const buy = 0;
      await dex.deposit(symbolDAI, depositAmount, { from: trader1 });
      await dex.deposit(symbolDAI, depositAmount, { from: trader2 });
      await dex.limitOrder(symbolBNB, orderAmount, price1, buy, { from: trader1 });
      await dex.limitOrder(symbolBNB, orderAmount, price2, buy, { from: trader2 });
      await dex.limitOrder(symbolBNB, orderAmount, price3, buy, { from: trader1 });
      await dex.limitOrder(symbolBNB, orderAmount, price4, buy, { from: trader2 });
      await dex.limitOrder(symbolBNB, orderAmount, price5, buy, { from: trader1 });
      const buyOrders = await dex.getOrders(symbolBNB, buy);
      assert.equal(buyOrders.length, 5);
      assert.equal(buyOrders[0]["price"], price5);
      assert.equal(buyOrders[1]["price"], price2);
      assert.equal(buyOrders[2]["price"], price3);
      assert.equal(buyOrders[3]["price"], price1);
      assert.equal(buyOrders[4]["price"], price4);
    });
    it("Should not create limit order if token does not exist", async () => {
      const amount = toWei("10000");
      const price = 50;
      const symbol = web3.utils.fromAscii("BAT");
      await expectRevert(dex.limitOrder(symbol, amount, price, 0, { from: trader1 }), "Token does not exist");
    });
    it("Should not create limit order if token is dai", async () => {
      const amount = toWei("10000");
      const price = 50;
      const symbol = web3.utils.fromAscii("DAI");
      await expectRevert(dex.limitOrder(symbol, amount, price, 0, { from: trader1 }), "DAI cannot be traded");
    });
    it("Should not create buy limit order if balance is too low", async () => {
      const amount = toWei("10000");
      const price = 50;
      const symbolDAI = web3.utils.fromAscii("DAI");
      const symbolBNB = web3.utils.fromAscii("BNB");
      await dex.deposit(symbolDAI, amount, { from: trader1 });
      await expectRevert(dex.limitOrder(symbolBNB, amount, price, 0, { from: trader1 }), "Not enough tokens");
    });
    it("Should not create sell limit order if balance is too low", async () => {
      const depositAmount = toWei("10000");
      const orderAmount = toWei("100000");
      const price = 50;
      const symbol = web3.utils.fromAscii("BNB");
      await dex.deposit(symbol, depositAmount, { from: trader1 });
      await expectRevert(dex.limitOrder(symbol, orderAmount, price, 1, { from: trader1 }), "Not enough tokens");
    });
    it("Should create market order and mark it as filled", async () => {
      const symbolDAI = web3.utils.fromAscii("DAI");
      const symbolBNB = web3.utils.fromAscii("BNB");
      const buy = 0;
      const sell = 1;
      // Trader1 makes Limit Buy Order - Buying 100 BNB Tokens at 10 DAI per token
      await dex.deposit(symbolDAI, toWei("1000"), { from: trader1 });
      await dex.limitOrder(symbolBNB, toWei("100"), 10, buy, { from: trader1 });
      // Trader2 makes Market Sell Order - Selling 10 BNB Tokens at Market Price
      await dex.deposit(symbolBNB, toWei("1000"), { from: trader2 });
      await dex.marketOrder(symbolBNB, toWei("10"), sell, { from: trader2 });
      /*
      Trader 1 w/ 1000 DAI places a limit buy order of 100 BNB at 10 DAI
      Trader 2 w/ 1000 BNB places a market sell order of 10 BNB
      ---
      Trader 1 ends with a balance of 900 DAI, since only 10 BNB out of the 100 were filled (1000 - 10 * 10), and a balance of 10 BNB
      Trader 2 ends with a balance of 100 DAI (10 BNB were sold at 10 DAI per BNB), and 990 BNB
      */
      // Verify Balances
      const buyOrders = await dex.getOrders(symbolBNB, buy);
      assert.equal(fromWei(buyOrders[0]["filled"]), "10");
      trader1DAI = await dex.balances(trader1, symbolDAI);
      trader1BNB = await dex.balances(trader1, symbolBNB);
      trader2DAI = await dex.balances(trader2, symbolDAI);
      trader2BNB = await dex.balances(trader2, symbolBNB);
      assert.equal(fromWei(trader1DAI.toString()), "900");
      assert.equal(fromWei(trader1BNB.toString()), "10");
      assert.equal(fromWei(trader2DAI.toString()), "100");
      assert.equal(fromWei(trader2BNB.toString()), "990");
    });
    it("Should not create market order if token does not exist", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("BAT");
      await expectRevert(dex.marketOrder(symbol, amount, 0, { from: trader1 }), "Token does not exist");
    });
    it("Should not create market order if token is dai", async () => {
      const amount = toWei("10000");
      const symbol = web3.utils.fromAscii("DAI");
      await expectRevert(dex.marketOrder(symbol, amount, 0, { from: trader1 }), "DAI cannot be traded");
    });
    it("Should not create buy market order if balance is too low", async () => {
      const amount = toWei("100");
      const symbol = web3.utils.fromAscii("BNB");
      const price = 10;
      await dex.deposit(symbol, amount, { from: trader1 });
      await dex.limitOrder(symbol, amount, price, 1, { from: trader1 });
      await expectRevert(dex.marketOrder(symbol, amount, 0, { from: trader2 }), "Not enough tokens");
    });
    it("Should not create sell market order if balance is too low", async () => {
      const depositAmount = toWei("10000");
      const orderAmount = toWei("100000");
      const symbol = web3.utils.fromAscii("BNB");
      await dex.deposit(symbol, depositAmount, { from: trader1 });
      await expectRevert(dex.marketOrder(symbol, orderAmount, 1, { from: trader1 }), "Not enough tokens");
    });
  });
});
