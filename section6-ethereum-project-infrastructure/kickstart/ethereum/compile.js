// require ('../contracts/Campaign.sol');   // BAD! because node will execute this file
// import modules that will let us import the .sol file
const path = require("path");

// import improved version of file system module
const fs = require("fs-extra");

// import solidity compiler
const solc = require("solc");

// 1) delete entire build folder
// generate path to our smart contract (for cross-OS compatibility)
const buildPath = path.resolve(__dirname, "build");
// __dirname = constant defined by node thats the current working directory (/kickstart)
// console.log(buildPath);  //=> '/Users/eib/Desktop/ethereum-solidity/section6-ethereum-project-infrastructure/kickstart/ethereum/build'

// remove build folder
fs.removeSync(buildPath);

// 2) read Campaign.sol from the contracts folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

// get contents of file
const source = fs.readFileSync(campaignPath, "utf8");

// compile both contracts with solidity compiler
const output = solc.compile(source, 1).contracts;
// - output contains two objects, one for each contract (factory contract , and campaign contract) in the file

// rercreate build folder
fs.ensureDirSync(buildPath);

// loop over contract object abd write outputs to the build directory
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}
