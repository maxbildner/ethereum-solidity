# Notes From Article Below:

# Title: A Definitive Guide to Ethereum EIP-1559 Gas Fee Calculations: Base Fee, Priority Fee, Max Fee

https://www.blocknative.com/blog/eip-1559-fees

## EIP-1559
- Ethereum Improvement Protocol 1559
- Instead of Gas Price, there are now 3 separate values: 
  - Base Fee (set by network)
  - maxPriorityFeePerGas ("optional" tip set by sender)
  - maxFeePerGas (Base Fee + maxPriorityFeePerGas, set by sender)
- Still a gasLimit value in transaction object

## Type 2 Transaction
- Transactions under the new EIP-1559 that include 3 separate values (Base Fee, maxPriorityFeePerGas, maxFeePerGas) instead of only gasPrice

## Type 0 Transaction
- legacy/old transactions that only have gasPrice as a key in the transaction object

## Base Fee
- determined by network, and is burned
- will increase based on demand for processing transactions
- base fee goes up if most recent block more full of transactions
- base fee goes down if most recent block less full of transactions
- don't need to set this key/value in transaction object, bec it's set automatically
- this helps smooth transaction fees and prevent sudden spikes
- min gas price for your transaction

## Max Priority Fee (maxPriorityFeePerGas)
- like a "tip" to the miners, set by sender of transaction
- in web3.js the transaction object key is = maxPriorityFeePerGas
- more tip -> miners more likely to process transaction faster
- !! optional, but transactions usually require a minimum 2.0 GWEI tip
- if Base Fee + maxPriorityFeePerGas > maxFeePerGas, then maxPriorityFeePerGas will be reduced to meet condition of Base Fee + maxPriorityFeePergas = maxFeePerGas
- by default, version ^10.0.0 of MetaMask will automatically set your transaction's maxPriorityFeePerGas (you can override these)

## Max Fee Per Gas (maxFeePerGas)
- maximum sender is willing to pay per unit of gas to process transaction
- !!maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas
- in web3.js the transaction object key = maxFeePerGas 
- if Base Fee increases while transaction is pending, your transaction could become underpriced/stuck or dropped. 
- !!recommended to set MaxFeePerGas = 2 * BaseFee + MaxPriorityFeePerGas
  - doubling your base fee ensures that your transaction will remain marketable for 6 consecutive 100% full blocks. this ensures predictable transaction settlement time/cost
- this fee is NOT withdrawn from your wallet and then some portion is refunded. Instead the maxFee is the maximum authorized charge threshold
- most of the times, you will not pay the Max Fee (only when network is congested)

## ? First-Price Auction
- 

## ? Burning 
- 

## ? Transaction Underpriced



# Terms to Understand Before Reading Article:
## Gas
- a unit of measure 
- measures how much "work" it costs to execute code. Ex. it could cost 3 gas to add two numbers together in a smart contract function

## Gas Price (Wei)
- Amount of Wei sender of a transaction is willing to pay per 1 unit of gas
- Ex. if the Gas Price is 100 (wei) for 1 gas, and it costs 3 gas to add two numbers together, then the total fees I would pay would be 300 Wei (i.e. 3 * 100)

## Gas Limit 
- set by sender of transaction
- maximum amount of gas that this transaction can consume 
- leftover gas gets sent back to sender

## Gwei vs Wei vs Ether
- Gwei (smallest) < Wei < Ether
- 1 Ether == 10^18 Wei == 1,000,000,000,000,000,000 Wei
- 1 Gwei == 1,000,000,000 Wei

## NFT DROP
- release of NFT's at an eact date/time
- date that a particular NFT is available for people to buy


## Questions to look up
- Why doesn't running getter methods (methods that don't modify the Solidity state) cost anything?
  - https://ethereum.stackexchange.com/questions/31588/is-reading-data-free-unlike-a-transaction
  - https://ethereum.stackexchange.com/questions/31197/who-what-or-where-is-a-contract-executed-on-a-call/31209#31209
  - "because function can be run directly on the node you are connected to" 
  - https://stackoverflow.com/questions/67610072/why-do-automatically-generated-getter-functions-incur-gas-cost

- What's a good way to calculate gasLimit (gas) for a transaction?
  - depends on operations in the solidity function/method. More operations would cost more gas
  - "standard" gasLimit is around 21,000 gas
    - https://masterthecrypto.com/
    ethereum-what-is-gas-gas-limit-gas-price/
  - take Estimated Gas Limit + constant
    - constant = 50-100k
    - Est Gas Limit = deteremined by the number of bytes of the method/function and operations used?
  - https://ethereum.stackexchange.com/questions/39401/how-do-you-calculate-gas-limit-for-transaction-with-data-in-ethereum
  - https://ethereum.github.io/yellowpaper/paper.pdf

- If the "type" key isn't specified in web3.js transaction object, what will the default be?

- What's a type 1 transaction then? if legacy is type 0, and new EIP-1559 is type 2?

- What happens if you set maxFeePerGas lower than the Base Fee?
  - need to test this out in remix