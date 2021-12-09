import React from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input, Modal } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import {
  metaMaskIsInstalled,
  connectedToCorrectNetwork,
  isEmptyForm,
  anyFormsIsEmpty,
  getRevertReason,
} from "../../../utils";

class RequestNew extends React.Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
    firstRender: true, // becomes false after submitting form
    showModal: false, // for display success modal after creating request
  };

  static async getInitialProps(props) {
    const { address } = props.query; // eth address component of url
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { description, value, recipient } = this.state;

    // if any form is empty, exit
    if (anyFormsIsEmpty([description, value, recipient])) {
      this.setState({ firstRender: false });
      return;
    }

    this.setState({ loading: true, errorMessage: "" });

    try {
      // display error if user doesn't have metamask installed
      if (!metaMaskIsInstalled()) {
        this.setState({ errorMessage: "You must have MetaMask installed!" });

        // if user isn't connected to Rinkby Test Netowork, display error and exit function
      } else if (!(await connectedToCorrectNetwork())) {
        this.setState({
          errorMessage: "You must be connected to the Rinkby Test Network!",
        });
      } else if (value <= 0) {
        this.setState({
          errorMessage: "You must enter a value greater than zero!",
        });
      } else {
        // create instance of campaign smart contract
        const campaign = Campaign(this.props.address);

        const { description, value, recipient } = this.state;

        // get list of eth wallet addresses from metamask
        const accounts = await web3.eth.getAccounts();

        await campaign.methods
          .createRequest(
            description,
            web3.utils.toWei(value, "ether"), // contract method is expecting wei
            recipient
          )
          .send({
            from: accounts[0],
          });

        this.setState({ showModal: true });
      }
    } catch (err) {
      console.log(err);

      let errorReason;
      if (err.receipt) {
        let transactionHash = err.receipt.transactionHash;
        errorReason = await getRevertReason(transactionHash);
      }

      this.setState({ errorMessage: errorReason || err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const {
      loading,
      errorMessage,
      value,
      description,
      recipient,
      firstRender,
      showModal,
    } = this.state;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back to Requests</a>
        </Link>

        <h3>Create a Request</h3>

        <Modal
          open={showModal}
          actions={["OK"]}
          onClose={() => {
            this.setState({ showModal: false });
            // redirect user back to requests page
            // - pushRoute makes url available in history (see replaceRoute if we don't want url to be in history)
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
          }}
          content="Success! New request created. Now redirecting you to requests page..."
        />

        <Form onSubmit={this.onSubmit} error={!!errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              disabled={loading}
              error={isEmptyForm(description) && !firstRender}
              placeholder="Enter request description"
            />
            <div
              className={
                isEmptyForm(description) && !firstRender
                  ? "required-error"
                  : "hidden"
              }
            >
              required!
            </div>
          </Form.Field>

          <Form.Field>
            <label>Value (Ether)</label>
            <Input
              value={value}
              onChange={(e) => this.setState({ value: e.target.value })}
              disabled={loading}
              error={isEmptyForm(value) && !firstRender}
              type="number"
              placeholder="Enter amount to send to recipient"
            />
            <div
              className={
                isEmptyForm(value) && !firstRender ? "required-error" : "hidden"
              }
            >
              required!
            </div>
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={recipient}
              onChange={(e) => this.setState({ recipient: e.target.value })}
              disabled={loading}
              error={isEmptyForm(recipient) && !firstRender}
              placeholder="Enter recipient ethereum wallet address"
            />
            <div
              className={
                isEmptyForm(recipient) && !firstRender
                  ? "required-error"
                  : "hidden"
              }
            >
              required!
            </div>
          </Form.Field>

          <Message error header="Error:" content={errorMessage} />

          <Button loading={loading} primary disabled={loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
