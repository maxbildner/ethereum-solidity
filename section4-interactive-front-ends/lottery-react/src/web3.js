import Web3 from "web3";

// BELOW IS OLD
// create new web3 instance, and "rip" out provider
// - window.web3 = web3 coming from metamask injection
// - window.web3.currentProvider = provider given to metamask (preconfigured to Rinkeby Test)
// const web3 = new Web3(window.web3.currentProvider);

// web3.js module will need to be updated to inlcude curent methhod for accesing metamask
window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

export default web3;
