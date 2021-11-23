import React from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";

// import instance of campaign smart contract
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import {
  connectedToCorrectNetwork,
  metaMaskIsInstalled,
  isNumber,
} from "../utils";

class ContributeForm extends React.Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false, // for showing loading animation on button
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      if (this.state.value < 0.001) {
        this.setState({ errorMessage: ".001 ETH Minimum Contribution!" });

        // display error if user doesn't have metamask installed
      } else if (metaMaskIsInstalled()) {
        this.setState({ errorMessage: "You must have MetaMask installed!" });

        // if user isn't connected to Rinkby Test Netowork, display error and exit function
      } else if (!(await connectedToCorrectNetwork())) {
        this.setState({
          errorMessage: "You must be connected to the Rinkby Test Network!",
        });
      } else {
        const campaign = Campaign(this.props.address);

        // get users ETH account connected with their metamask wallet
        const accounts = await web3.eth.getAccounts();

        // donate money to campaign
        await campaign.methods.contribute().send({
          from: accounts[0], // address of user who wants to donate money
          value: web3.utils.toWei(this.state.value, "ether"), // wei to donate
        });

        // redirect user to same page to force refresh
        Router.replaceRoute(`/campaigns/${this.props.address}`);
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    const { errorMessage, loading, value } = this.state;

    return (
      <Form onSubmit={this.onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to Contribute (.001 ETH Min)</label>
          <Input
            label="ether"
            labelPosition="right"
            value={value}
            onChange={(e) => {
              this.setState({ value: e.target.value });

              if (!isNumber(e.target.value)) {
                this.setState({ errorMessage: "Must enter a valid number" });
              } else {
                this.setState({ errorMessage: "" });
              }
            }}
            disabled={loading}
          />
        </Form.Field>
        <Message error header="Error:" content={errorMessage} />
        <Button
          primary // color blue
          loading={loading}
          disabled={loading || !isNumber(value)}
        >
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
