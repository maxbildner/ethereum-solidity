// HELPER FUNCTIONS

// returns true if user is connected to Rinkby Test Network
const connectedToCorrectNetwork = async () => {
  let chainId = await ethereum.request({ method: "eth_chainId" });

  // "0x1" == ethereum main net
  // "0x4" == rinkby test

  return chainId === "0x4";
};

// returns true if metamask is installed
const metaMaskIsInstalled = () => {
  return (
    typeof window !== "undefined" && // code is run in the browser
    typeof window.ethereum == "undefined" // user does NOT have metamask installed)
  );
};

// returns true if input string is not empty
// const isValidForm = (form) => {
//   form = form.replace(/\s/g, "") // removes empty spaces
//   return !!form
// }

export { connectedToCorrectNetwork, metaMaskIsInstalled };
