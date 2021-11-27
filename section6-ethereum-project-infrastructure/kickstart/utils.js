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

export {
  connectedToCorrectNetwork,
  metaMaskIsInstalled,
  isNumber,
  isEmptyForm,
  anyFormsIsEmpty,
};
