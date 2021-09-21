// import node.js library that allows us to run tests
const assert = require("assert");

// serves as our local ethereum test network
const ganache = require("ganache-cli");

// note Web3 is uppercase!! bec. we are importing a constructor function
//   used to create instances of the web3 library
const Web3 = require("web3");

// create an instance of Web3, pass in a PROVIDER
// PROVIDER = way to communicate between a web3 instance and a specific ethereum network
const web3 = new Web3(ganache.provider());

// import compiled smart contract output and destructure object
const { interface, bytecode } = require("../compile"); // interface = ABI

// MOCHA TESTING
let accounts;
let inbox;

// cb will run before each it block
beforeEach(async () => {
  // // With Callback:
  // // Get a list of all accounts (unlocked = can freely send/receive ether)
  // web3.eth.getAccounts()
  // // - .eth is a module in the web3 library that lets us interact with the Ethereum network
  // // - almost all methods we work with are asynchronous and will return a promise
  // // => returns a promise that resolves to a list of accounts
  //   .then(fetchedAccounts => {
  //     console.log(fetchedAccounts); //=> ['address', 'address', ...]
  //   });

  // With New Syntax Async Await:
  // Get a list of all accounts (unlocked = can freely send/receive ether)
  accounts = await web3.eth.getAccounts();
  // => returns a promise that resolves to a list of accounts

  // Use one of thoese accounts to deploy the contract
  // create a JS instance of a contract
  // - interface tells web3 what methods the Inbox contract has
  // - has a methods property (with methods defined in the .sol file)
  // - has options property (with info about the contract like address, gasPrice, gas, ...)
  inbox = await new web3.eth.Contract(JSON.parse(interface))

    // tells web3 that we want to deploy a new contract
    // - data and arguments are properties of a transaction object
    // - arguments is list of arguments thats passed into contructor function of contract
    .deploy({ data: bytecode, arguments: ["YO"] })

    // tells web3 to send out a transaction that creates this contract
    // - gas = quantity of how much it'll cost to do operations (paid by sender of the transaction)
    // - gas * gasPrice = total fee
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    // console.log(accounts);
    // console.log(inbox);
    // presence of an address is a good way to check for presence of a contract
    // - assert.ok( ), does what you pass into the assert.ok exist
    assert.ok(inbox.options.address);
  });

  // when we create a new contract, it has a default message
  it("has a default message", async () => {
    // .methods returns an object that has all the methods of our contract
    // - .message() args passed into methods
    // - .call() means that we are making a call (not sending a transaction)
    const message = await inbox.methods.message().call();
    assert.equal(message, "YO");
  });

  it("can change the message", async () => {
    // - .send() means we are sending a transaction (i.e. modifying data on the contract)
    // - takes in obj, that requires who is going to pay (from: address)
    // - we're having 1st account in accounts pay for transaction
    // - send() => returns transaction hash (like a receipt)
    // - if everything goes ok, then no errors will occur
    await inbox.methods.setMessage("POTATO").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "POTATO");
  });
});
