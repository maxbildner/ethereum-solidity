// require ('../contracts/Inbox.sol');   // BAD! because node will execute this file
// import modules that will let us import the .sol file
const path = require("path");
const fs = require("fs");

// import solidity compiler
const solc = require("solc");

// generate path to our smart contract (for cross-OS compatibility)
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
// __dirname = constant defined by node thats the current working directory (/lottery)
// console.log(lotteryPath);  //=> '/Users/eib/Desktop/ethereum-solidity/section3-advanced-smart-contracts/lottery/contracts/Lottery.sol'

// read in the contents of the smart contract file
const source = fs.readFileSync(lotteryPath, "utf8");

// compile our smart contract file, and export just the bytecode
module.exports = solc.compile(source, 1).contracts[":Lottery"];
// solc.compile() => returns object
// {
//   contracts: { ':Lottery':{assembly, bytecode: '', interface, } }
// }

// interface = ABI (Application Binary Interface),
//  - lists out all the different functions that exist on the contract
//  - also specifies arguments/return values
//  - JSON Format
