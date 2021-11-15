import React from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";

// import instance of campaign smart contract
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

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
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(e) => this.setState({ value: e.target.value })}
            disabled={this.state.loading}
          />
        </Form.Field>
        <Message error header="Error:" content={this.state.errorMessage} />
        <Button
          primary // color blue
          loading={this.state.loading}
          disabled={this.state.loading}
        >
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
