// import Web3 Library
import Web3 from "web3";

// OLD/Deprecated:
// const web3 = new Web3(window.web3.currentProvider);

// NEW:
window.ethereum.request({method: "eth_requestAccounts"});

// create instance of web3, pass in provider from metamask
const web3 = new Web3(window.ethereum);
// - will refactor later, bec. this will error out if user doesn't have metamask

export default web3;