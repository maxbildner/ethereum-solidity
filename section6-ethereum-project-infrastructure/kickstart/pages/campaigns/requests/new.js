import React from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

class RequestNew extends React.Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  };

  static async getInitialProps(props) {
    const { address } = props.query; // eth address component of url
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    // create instance of campaign smart contract
    const campaign = Campaign(this.props.address);

    const { description, value, recipient } = this.state;

    try {
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

      // redirect user back to requests page
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back to Requests</a>
        </Link>

        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
              disabled={loading}
            />
          </Form.Field>

          <Form.Field>
            <label>Value (Ether)</label>
            <Input
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
              disabled={loading}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(e) => this.setState({ recipient: e.target.value })}
              disabled={loading}
            />
          </Form.Field>

          <Message error header="Error:" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary disabled={loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
