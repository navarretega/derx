// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract Dex {
    
    using SafeMath for uint;
    
    // Type of Exchange Order - BUY or SELL
    enum OrderOperation { BUY, SELL }
    
    // Trade Event
    event Trade(uint tradeId, uint orderId, bytes32 indexed symbol, uint price, uint amount, uint date, address indexed trader1, address indexed trader2);
    
    /*  
       Struct about a Token instance - Symbol and Address
       symbol = LINK
       tokenAddress = 0x514910771af9ca656af840dff83e8264ecf986ca
    */
    struct Token {
        bytes32 symbol;
        address tokenAddress;
    }
    
    /*  
       Exchange Orders (Buy or Sell)
       uint = 1
       operation = BUY
       symbol = LINK
       price = 20
       amount = 10
       filled = 0
       date = now
    */
    struct Order {
        uint id;
        OrderOperation operation;
        address trader;
        bytes32 symbol;
        uint price;
        uint amount;
        uint filled;
        uint date;
    }
    
    /*  
        Orderbook (Buy and Sell) - Collection of Orders
        {
            LINK: {
                0: [Order(0, BUY, LINK, 20, 5, 0, now), Order(1, BUY, LINK, 20, 40, 0, now)], // You want keep them in desc order (50, 40, 30, 20) - max price first
                1: [Order(2, SELL, LINK, 20, 10, 0, now), Order(3, SELL, LINK, 20, 20, 0, now)], // You want keep them in asc order (50, 60, 70, 80) - min price first
            },
            BNB: {
                0: [...],
                1: [...]
            }
        }
    */
    mapping(bytes32 => mapping(uint => Order[])) public orderbook;
    
    /*  
        Collection of each user address to represent the token balance for each token
        {
            0x7133079C6721165F0344f12F077d9006Fecb8523: {
                LINK: 3,
                BNB: 4.25,
                YFI: 18.75
            },
            0x4f6bA06A6db2cCC4BEe008d54979820049669aa8: {
                BNB: 300.10
            }
        }
    */
    mapping(address => mapping(bytes32 => uint)) public balances;
    
    /*  
        Collection of tokens
        {
            LINK: Token(LINK, 0x514910771af9ca656af840dff83e8264ecf986ca),
            BNB: Token(BNB, 0xB8c77482e45F1F44dE1745F52C74426C631bDD52),
            YFI: Token(YFI, 0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e)
        }
    */
    mapping(bytes32 => Token) public tokens;
    
    /*  
        List of Token Symbols (ids) so we can iterate ** We can't easily iterate over a mapping **
        ['BNB', 'LINK', 'YFI']
    */
    bytes32[] public tokenSymbols;
    
    // Keep track of order IDS
    uint public nextOrderID = 0;

    // Keep track of trade IDS
    uint public nextTradeID = 0;
    
    /*  
        Address of creator/admin of Smart Contract
        admin = 0x7133079C6721165F0344f12F077d9006Fecb8523
    */
    address public admin;
    
    // DAI
    bytes32 constant DAI = bytes32('DAI');
    
    // Assign address at creation
    constructor() public {
        admin = msg.sender;
    }
    
    // Add token to collections
    function addToken(bytes32 symbol, address tokenAddress) onlyAdmin() external {
        tokens[symbol] = Token(symbol, tokenAddress);
        tokenSymbols.push(symbol);
    }
    
    // Deposit Tokens to Exchange
    function deposit(bytes32 symbol, uint amount) tokenExists(symbol) external {
        IERC20(tokens[symbol].tokenAddress).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender][symbol] = balances[msg.sender][symbol].add(amount);
    }
    
    // Widthraw Tokens from Exchange
    function widthraw(bytes32 symbol, uint amount) tokenExists(symbol) external {
        require(balances[msg.sender][symbol] >= amount, 'Not enough tokens');
        IERC20(tokens[symbol].tokenAddress).transfer(msg.sender, amount);
        balances[msg.sender][symbol] = balances[msg.sender][symbol].sub(amount);
    }
    
    // Limit Order
    function limitOrder(bytes32 symbol, uint amount, uint price, OrderOperation operation) tokenExists(symbol) isNotDai(symbol) external {
        if(operation == OrderOperation.SELL) {
            // You cannot sell more tokens that what you currently have
            require(balances[msg.sender][symbol] >= amount, 'Not enough tokens');
        } else {
            // You cannot buy tokens if you don't have enough balance - Remember you buy tokens with respect to DAI
            require(balances[msg.sender][DAI] >= amount.mul(price), 'Not enough tokens');
        }

        // Add order to orderbook for the given symbol
        Order[] storage orders = orderbook[symbol][uint(operation)]; // orderbook[LINK][0] -> 0 means BUY and 1 means SELL
        orders.push(Order(nextOrderID, operation, msg.sender, symbol, price, amount, 0, now));

        // Sort orderbook (last order) - Insertion Sort with complexity of O(n)
        // If it a SELL order, we want to sort in ASC (smallest to largest)
        uint ordersLength = orders.length > 0 ? orders.length.sub(1) : 0;
        if(operation == OrderOperation.SELL) {
            for (uint i = ordersLength; i > 0; i = i.sub(1)) {
                if (orders[i].price < orders[i.sub(1)].price) {
                    Order memory order = orders[i];
                    orders[i] = orders[i.sub(1)];
                    orders[i.sub(1)] = order;
                }
            }
        }
        // If it a BUY order, we want to sort in DESC (largest to smallest)
        else {
            for (uint i = ordersLength; i > 0; i = i.sub(1)) {
                if (orders[i].price > orders[i.sub(1)].price) {
                    Order memory order = orders[i];
                    orders[i] = orders[i.sub(1)];
                    orders[i.sub(1)] = order;
                }
            }          
        }
        
        // Increment OrderID
        nextOrderID = nextOrderID.add(1);
        
    }
    
    // Market Order
    function marketOrder(bytes32 symbol, uint amount, OrderOperation operation) tokenExists(symbol) isNotDai(symbol) external {
        // Get int OrderOperation (0 - Buy | 1 - Sell)
        uint op;
        if(operation == OrderOperation.SELL) {
            // You cannot sell more tokens that what you currently have
            require(balances[msg.sender][symbol] >= amount, 'Not enough tokens');
            op = 0; // Opposite - Since it is a SELL order we want to get the max BUY price
        } else {
            op = 1; // Opposite - Since it is a BUY order we want to get the min SELL price
        }
        
        Order[] storage orders = orderbook[symbol][op];
        
        // Start filling the order
        uint i = 0;
        uint remaining = amount;
        while(i < orders.length && remaining > 0) {
            // Find liquidity
            uint available = orders[i].amount.sub(orders[i].filled);
            uint matched = (remaining > available) ? available : remaining;
            remaining = remaining.sub(matched);
            orders[i].filled = orders[i].filled.add(matched);
            // Emit Trade
            emit Trade(nextTradeID, orders[i].id, symbol, orders[i].price, matched, now, orders[i].trader, msg.sender);
            // Update Balance
            if (operation == OrderOperation.SELL) {
                // Trader1
                balances[msg.sender][symbol] = balances[msg.sender][symbol].sub(matched);
                balances[msg.sender][DAI] = balances[msg.sender][DAI].add(matched.mul(orders[i].price));
                // Trader2
                balances[orders[i].trader][symbol] = balances[orders[i].trader][symbol].add(matched);
                balances[orders[i].trader][DAI] = balances[orders[i].trader][DAI].sub(matched.mul(orders[i].price));
            } else {
                // You cannot buy tokens if you don't have enough balance - Remember you buy tokens with respect to DAI
                require(balances[msg.sender][DAI] >= matched.mul(orders[i].price), 'Not enough tokens');
                // Trader1
                balances[msg.sender][symbol] = balances[msg.sender][symbol].add(matched);
                balances[msg.sender][DAI] = balances[msg.sender][DAI].sub(matched.mul(orders[i].price));
                // Trader2
                balances[orders[i].trader][symbol] = balances[orders[i].trader][symbol].sub(matched);
                balances[orders[i].trader][DAI] = balances[orders[i].trader][DAI].add(matched.mul(orders[i].price));
            }
            
            // Increment TradeID
            nextTradeID = nextTradeID.add(1);
            
            i = i.add(1);
        }
        
        // Clean OrderBook if order has been filled
        i = 0;
        while (i < orders.length && orders[i].filled == orders[i].amount) {
            for(uint j = i; j < orders.length.sub(1); j = j.add(1)) {
                orders[j] = orders[j.add(1)];
            }
            orders.pop();
            i = i.add(1);
        }
    }
    
    // Return Orders
    function getOrders(bytes32 symbol, OrderOperation operation) external view returns(Order[] memory) {
        return orderbook[symbol][uint(operation)];
    }
    
    // Return Tokens
    function getTokens() external view returns(Token[] memory) {
        Token[] memory toks = new Token[](tokenSymbols.length);
        for (uint i = 0; i < tokenSymbols.length; i++) {
            toks[i] = Token(tokens[tokenSymbols[i]].symbol, tokens[tokenSymbols[i]].tokenAddress);
        }
        return toks;
    }
    
    // Token Modifer - Assert Token exists in collections
    // address(0) is the default address for an undefined element with a type of address
    modifier tokenExists(bytes32 symbol) {
        require(tokens[symbol].tokenAddress != address(0), 'Token does not exist');
        _;
    }
    
    // DAI Modifier - Assert DAI is not being used to trade
    modifier isNotDai(bytes32 symbol) {
        require(symbol != DAI, 'DAI cannot be traded');
        _;
    }
    
    // Admin Modifier - Only Andmin can access
    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only Admin');
        _;
    }
    
}