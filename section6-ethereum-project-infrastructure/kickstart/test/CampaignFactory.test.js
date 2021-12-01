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

// import 2 compiled smart contract outputs (machine code as json)
// - each compiled json has the contract bytecode and interface (abi)
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts; // all unlocked account addressses/generated by ganache-cli
let factory; // reference to deployed instance of factory we're going to make
let campaignAddress;
let campaign;

// CAMPAIGN FACTORY CONTRACT TESTS ************************************************************
// cb will run before each it block
beforeEach(async () => {
  // Get a list of all accounts (unlocked = can freely send/receive ether)
  accounts = await web3.eth.getAccounts(); // 10 generated "fake" accounts
  // => returns a promise that resolves to a list of accounts

  // Use one of those accounts to deploy the contract
  // create a JS instance of a factory contract
  // - interface tells web3 what methods the factory contract has
  //    - has a methods property (with methods defined in the .sol file)
  //    - has options property (with info about the contract like address, gasPrice, gas, ...)
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))

    // tells web3 that we want to deploy a new contract
    // - data and arguments are properties of a transaction object
    // - arguments is list of arguments thats passed into contructor function of contract
    .deploy({ data: compiledFactory.bytecode }) //=> transaction object

    // tells web3 to send out a transaction that creates this contract
    // - gas = quantity of how much it'll cost to do operations (paid by sender of the transaction)
    // - gas * gasPrice = total fee
    .send({ from: accounts[0], gas: "1000000" }); // arbitrarily put 1m
  //=> proimse that resolves to transaction hash (like a receipt)
});

describe("Campaign Factory Contract", () => {
  it("deploys a factory contract", async () => {
    // presence of an address is a good way to check for presence of a contract
    // - assert.ok( ), does what you pass into the assert.ok exist
    assert.ok(factory.options.address);
  });

  describe("#createCampaign()", () => {
    it("requires a minimum contribution of at least 100 wei", async () => {
      try {
        // try creating valid campaign- we should not hit catch if method code is correct
        await factory.methods.createCampaign(100).send({
          from: accounts[0],
          gas: "1000000",
        });
      } catch (err) {
        assert(false);
      }

      try {
        // try creating invalid campaign
        await factory.methods
          .createCampaign(90) // 100 wei = min campaign contribution
          .send({
            from: accounts[0], // manager of campaign
            gas: "1000000",
          });

        // should hit this if contract method code is correct (i.e. does have correct require statement)
      } catch (err) {
        assert(err);
        return;
      }

      // we hit this if our contract method code is incorrect (i.e. doesn't have correct require statement)
      assert(false);
    });

    it("sets sender of function as the manager attribute of the campaign contract instance", async () => {
      await factory.methods
        .createCampaign("100") // 100 wei = min campaign contribution
        .send({
          from: accounts[0], // manager of campaign
          gas: "1000000",
        });

      // take first element that's returned from await array and assign it to campaignAddress
      [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
      // same as below:
      //  const addresses = await factory.methods.getDeployedCampaigns().call();
      //  campaignAddress = addresses[0];
      // // addresses == array of addresses that we have for deployed campaigns

      // // already deployed version of campaign contract
      campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
      );

      const manager = await campaign.methods.manager().call();
      assert.equal(accounts[0], manager);
    });

    it("sets the minimumContribution attribute of the campaign contract instance", async () => {
      let min = 500;

      await factory.methods.createCampaign(min).send({
        from: accounts[0], // manager of campaign
        gas: "1000000",
      });

      // take first element that's returned from await array and assign it to campaignAddress
      [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
      // same as below:
      //  const addresses = await factory.methods.getDeployedCampaigns().call();
      //  campaignAddress = addresses[0];
      // // addresses == array of addresses that we have for deployed campaigns

      // // already deployed version of campaign contract
      campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
      );

      const minimumContribution = await campaign.methods
        .minimumContribution()
        .call();
      assert.equal(minimumContribution, min);
    });
  });

  describe("#getDeployedCampaigns()", () => {
    it("returns array of deployed campaigns (addresses)", async () => {
      // create 1st campaign instance
      await factory.methods
        .createCampaign("100") // 100 wei = min campaign contribution
        .send({
          from: accounts[0], // manager of campaign
          gas: "1000000",
        });

      // get array of addresses that we have for deployed campaigns
      let addresses = await factory.methods.getDeployedCampaigns().call();

      assert.equal(addresses.length, 1);

      // create 2nd campaign instance
      await factory.methods.createCampaign("200").send({
        from: accounts[0],
        gas: "1000000",
      });

      // update addresses array
      addresses = await factory.methods.getDeployedCampaigns().call();

      assert.equal(addresses.length, 2);
    });
  });
});

// TO DO:
// CAMPAIGN FACTORY CONTRACT
// constructor
// - deploys campaign factory contract DONE

// #createCampaign()
// - min campaign contribution must be at least 100 wei DONE
// - sets sender of function as the manager of the campaign contract instance DONE
// - sets the minimumContribution attribute of the cmapaign contract instance DONE

// #getDeployedCampaigns()
// - returns array of deployed campaigns (addresses) DONE

// what happens when we try calling attribute deployedCampaigns (array) (without passing in idx)?
//  - will get error on front end