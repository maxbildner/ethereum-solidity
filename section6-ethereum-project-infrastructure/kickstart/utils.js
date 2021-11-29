import web3 from "./ethereum/web3";

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
    typeof window.ethereum !== "undefined" // user DOES have metamask installed
  );
};

// returns true if input string is empty
const isEmptyForm = (form) => {
  form = form.replace(/\s/g, ""); // removes empty spaces
  return !form;
};

// returns true if any form (array of strings) is empty
// returns false if all forms are not empty
const anyFormsIsEmpty = (forms) => {
  return !forms.every((form) => !isEmptyForm(form));
};

// returns true if input string is a number
// "2" => true
// "2a" => false
// "a2" => false
// "1.0a" => false
// "1." => true
const isNumber = (str) => {
  return !isNaN(parseFloat(str)) && !isNaN(str);
};
// console.log(isNumber("2")); // true
// console.log(isNumber("2.0")); // true
// console.log(isNumber("2.")); // true
// console.log(isNumber("2a")); // false
// console.log(isNumber("a2")); // false
// console.log(isNumber("asd")); // false

const getRevertReason = async (txHash) => {
  try {
    const tx = await web3.eth.getTransaction(txHash);

    var result = await web3.eth.call(tx, tx.blockNumber);

    result = result.startsWith("0x") ? result : `0x${result}`;

    if (result && result.substr(138)) {
      const reason = web3.utils.toAscii(result.substr(138));
      console.log("Revert reason:", reason);
      return reason;
    } else {
      console.log("Cannot get reason - No return value");
    }
  } catch (err) {
    if (err.message) {
      return err.message.split("\n")[0];
    }
    return err;
  }
};

export {
  connectedToCorrectNetwork,
  metaMaskIsInstalled,
  isNumber,
  isEmptyForm,
  anyFormsIsEmpty,
  getRevertReason,
};
