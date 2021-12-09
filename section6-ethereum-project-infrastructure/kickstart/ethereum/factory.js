// purpose of this file is so we don't have to write the code below multiple times
// - in other files we can just import instance

// import instance of web3 library (that's using provider from metamask)
import web3 from "./web3";

// contains Bytecode and ABI
import CampaignFactory from "./build/CampaignFactory.json";

// create new contract instance
const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface), // contract abi
  "0x0d77aF2722083cdbd55efb5cbFBC13ed8e973114" // address of campaign factory smart contract
);

export default factory;
