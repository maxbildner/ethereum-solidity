// require ('../contracts/Inbox.sol');   // BAD! because node will execute this file
// import modules that will let us import the .sol file
const path = require("path");
const fs = require("fs");

// import solidity compiler
const solc = require("solc");

// generate path to our smart contract (for cross-OS compatibility)
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
// __dirname = constant defined by node thats the current working directory (/inbox)
// console.log(inboxPath);  //=> '/Users/eib/Desktop/ethereum-solidity/section2-smart-contracts-solidity/inbox/contracts/Inbox.sol'

// read in the contents of the smart contract file
const source = fs.readFileSync(inboxPath, "utf8");

// compile our smart contract file, and export just the bytecode
module.exports = solc.compile(source, 1).contracts[":Inbox"]; // 1 = # of files we are compiling
// solc.compile() => returns object
// {
//   contracts: { ':Inbox':{assembly, bytecode: '', interface, } }
// }

// interface = ABI (Application Binary Interface), lists out all the different functions that
//   exist on the contract
