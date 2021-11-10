// import Web3 Library
import Web3 from "web3";

// OLD/Deprecated:
// const web3 = new Web3(window.web3.currentProvider);

// NEW Version 1.0:
// below won't work because window is undefined in node.js (but not on browser)
// window.ethereum.request({method: "eth_requestAccounts"});


// NEW Version 2.0:
let web3;

// if this code is run in the browser And the user has metamask
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({method: "eth_requestAccounts"});

  // create instance of web3, pass in provider from metamask
  web3 = new Web3(window.ethereum);

  // code is run on the server OR user doesn't have metamask
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/cc1f96fdcbee424ab0e5ab4671563c23" // URL to remote infura node (lets us connect to rinkbey)
  );

  web3 = new Web3(provider);
}



export default web3;