// import PROVIDER = allows us to connect web3 instance with Specific Network
// (ex. ganache local, or rinkeby, ...)
const HDWalletProvider = require("truffle-hdwallet-provider");

// note Web3 is uppercase!! bec. we are importing a constructor function
// - used to create instances of the web3 library
// - WEB3 LIBRARY = lets us interact with deployed contracts on the blockchain
const Web3 = require("web3");

// import bytcode and ABI
// - ABI = (JSON) interpretation layer that allows us to interact with bytecode)
const { interface, bytecode } = require("./compile");

const MNEMONIC_PHRASE = require("./mnemonic");

// set up provider
// - specificy which account we want to unlock
// - specifiy what outside node we're connecting to
// - Parameters:
//    - MNEMONIC (string) = represents your account
//      - never show this/publish even in private repo! this is just for test purposes
//        and this account doesn't have any real ether, only test ether
//    - url (string) = API endpoint we want to connect to
const provider = new HDWalletProvider(
  MNEMONIC_PHRASE,
  "https://rinkeby.infura.io/v3/cc1f96fdcbee424ab0e5ab4671563c23"
);

// create new Web3 instance
// - this instance can interact with the test network to send either, deploy/update contracts
const web3 = new Web3(provider);

// write a function so we can use the async await syntax
const deploy = async () => {
  // get list of all accounts that have been unlocked by wallet provider
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  // create a JS instance of a contract
  // - interface tells web3 what methods the Lottery contract has
  // - result will be an instance of our contract
  //   - has a methods property (with methods defined in the .sol file)
  //   - has options property (with info about the contract like address, gasPrice, gas, ...)
  const result = await new web3.eth.Contract(JSON.parse(interface))

    // tells web3 that we want to deploy a new contract
    // - data and arguments are properties of a transaction object
    // - arguments is list of arguments thats passed into contructor function of contract
    // - in this case we don't have any arguments going into constructor
    .deploy({ data: bytecode })

    // tells web3 to send out a transaction that creates this contract
    // - gas = quantity of how much it'll cost to do operations (paid by sender of the transaction)
    // - gas * gasPrice = total fee
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  // result.options.address => 0x7F26eEF2d246590e863eA8d4506ea2518bAb4C80
};

deploy();
