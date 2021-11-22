import React from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory"; // import instance of factory contract
import web3 from "../../ethereum/web3"; // import instance of web3
import { Router } from "../../routes";
import { connectedToCorrectNetwork, metaMaskIsInstalled } from "../../utils";

class CampaignNew extends React.Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false, // for showing loading animation on button
  };

  onSubmit = async (e) => {
    e.preventDefault(); // prevent default behavior of browser from submitting form to backend
    this.setState({ loading: true, errorMessage: "" });

    try {
      // display error if user doesn't have metamask installed
      if (metaMaskIsInstalled()) {
        this.setState({ errorMessage: "You must have MetaMask installed!" });

        // if user isn't connected to Rinkby Test Netowork, display error and exit function
      } else if (!(await connectedToCorrectNetwork())) {
        this.setState({
          errorMessage: "You must be connected to the Rinkby Test Network!",
        });

        // exit if minimumContribution is < 100
      } else if (this.state.minimumContribution < 100) {
        this.setState({
          errorMessage: "Minimum Contribution is at least 100 wei!",
        });
      } else {
        // get users ETH account connected with their metamask wallet
        const accounts = await web3.eth.getAccounts();

        await factory.methods
          .createCampaign(this.state.minimumContribution)
          .send({
            from: accounts[0],
          });

        // redirect user to home page
        // - pushRoute makes url available in history (see replaceRoute if we don't want url to be in history)
        Router.pushRoute("/");
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading, errorMessage } = this.state;

    return (
      <Layout>
        <h3>Create a Campaign</h3>

        {/* only display error message if it exists (non empty string) */}
        <Form onSubmit={this.onSubmit} error={!!errorMessage}>
          <Form.Field>
            <label>Minimum Contribution (100 wei):</label>
            <Input
              placeholder="Enter Minimum Contribution"
              type="number"
              labelPosition="right"
              label="wei"
              value={this.state.minimumContribution}
              onChange={(e) =>
                this.setState({ minimumContribution: e.target.value })
              }
              disabled={loading}
            />
          </Form.Field>

          <Message error header="Error:" content={errorMessage} />
          <Button loading={loading} primary disabled={loading}>
            Create Campaign
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
