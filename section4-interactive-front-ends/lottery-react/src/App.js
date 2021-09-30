import "./App.css";
import React from "react";
import web3 from "./web3";

// import local instance of contract (only exists on client browser)
import lottery from "./lottery";

class App extends React.Component {
  // use ES2016 sytnax, instead of constructor method
  state = { manager: "", players: [], balance: "", value: "", message: "" };
  // message = loading message/info about status of transaction
  // value = ether to enter to lottery

  // constructor(props) {
  //   super(props);
  //   this.state = { manager: "" };
  // }

  // runs once after first render
  async componentDidMount() {
    // get info from our local contract instance
    const manager = await lottery.methods.manager().call();
    // - NOTE whenever we're using the provider from metamask,
    //   we don't have to specify where the account is from in the call field
    //   default will be first account we are signed into in metamask
    // - manager = the ethereum address of the user who created the local contract instance

    const players = await lottery.methods.getPlayers().call();

    // get ethereum balance of smart contract
    let balance = await web3.eth.getBalance(lottery.options.address);
    // - pass in eth address of contract that we want to get the balance of
    // - web3.eth.getBalnce => returns an Obj (not a number!),
    // - Obj has balance in Wei

    // convert balance from Wei to Ether
    balance = web3.utils.fromWei(balance, "ether");

    this.setState({ manager, players, balance });
  }

  // send a transaction to the enter function on our lottery contract
  onClickEnter = async (event) => {
    // prevent classic way of form submission
    event.preventDefault();

    // alert and exit of value < .01 ether
    if (this.state.value <= 0.01) {
      alert("Must enter more than .01 Ether!");
      return;
    }

    // get list of all eth account addresses (in this case from metamask connected)
    const accounts = await web3.eth.getAccounts();
    // => returns a promise that resolves to a list of accounts

    // message = loading message/status of transaction
    this.setState({ message: "Waiting on transaction success..." });

    // send transaction to the network (could take 15-30 seconds)
    await lottery.methods.enter().send({
      from: accounts[0],
      // - we'll assume that the first account in the array is the one
      //   sending the transaction
      value: web3.utils.toWei(this.state.value, "ether"),
      // - amount of money we want to enter into the lottery contract
    });

    this.setState({ message: "You have been entered!" });
  };

  onClickPickWinner = async (event) => {
    // get list of active accounts (in this case provided by metamask)
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      // specify who is sending the transaction
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    // console.log(web3.version); //=> 1.5.3

    // log ethereum address to console
    // web3.eth.getAccounts().then(console.log);
    // - ? whey async await not needed above?
    console.log(this.state.message);

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} competing to win&nbsp;
          {this.state.balance} ether!
        </p>

        {/* add horizontal divider for style */}
        <hr />
        <form onSubmit={this.onClickEnter}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              // ? why below needed?
              // value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClickPickWinner}>Pick a winner!</button>
        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
