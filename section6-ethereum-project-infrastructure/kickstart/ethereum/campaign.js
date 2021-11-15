// purpose of this file is so we don't have to write the code below multiple times
//    - this function we export will be called serverside in show component

// import instance of web3 library (that's using provider from metamask)
import web3 from "./web3";

// contains Bytecode and ABI (interface)
import Campaign from "./build/Campaign.json";

// create instance of a campaign and return it
export default (address) => {
  return new web3.eth.Contract(
    JSON.parse(Campaign.interface), // contract abi
    address // address of campaign smart contract at a certain address
  );
};
