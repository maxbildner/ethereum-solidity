import React from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message, Modal } from "semantic-ui-react";
import factory from "../../ethereum/factory"; // import instance of factory contract
import web3 from "../../ethereum/web3"; // import instance of web3
import { Router } from "../../routes";
import { connectedToCorrectNetwork, metaMaskIsInstalled } from "../../utils";

class CampaignNew extends React.Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false, // for showing loading animation on button
    showModal: false,
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
      } else {
        // get users ETH account connected with their metamask wallet
        const accounts = await web3.eth.getAccounts();

        // call contract method to create a new campaign
        await factory.methods
          .createCampaign(this.state.minimumContribution)
          .send({
            from: accounts[0],
          });

        this.setState({ showModal: true });
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading, errorMessage, showModal, minimumContribution } =
      this.state;

    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Modal
          open={showModal}
          actions={["OK"]}
          onClose={() => {
            this.setState({ showModal: false });
            // redirect user to home page
            // - pushRoute makes url available in history (see replaceRoute if we don't want url to be in history)
            Router.pushRoute("/");
          }}
          content="Success! New campaign created. Now redirecting you to home page..."
        />

        {/* only display error message if it exists (non empty string) */}
        <Form onSubmit={this.onSubmit} error={!!errorMessage}>
          <Form.Field>
            <label>Minimum Contribution (100 wei):</label>
            <Input
              placeholder="Enter Minimum Contribution"
              type="number"
              min="100" // wei
              labelPosition="right"
              label="wei"
              value={minimumContribution}
              onChange={(e) =>
                this.setState({ minimumContribution: e.target.value })
              }
              disabled={loading}
            />
          </Form.Field>

          <Message error header="Error:" content={errorMessage} />
          <Button
            loading={loading}
            primary
            disabled={loading || minimumContribution === ""}
          >
            Create Campaign
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
