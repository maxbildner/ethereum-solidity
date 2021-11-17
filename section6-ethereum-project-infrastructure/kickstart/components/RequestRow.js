import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends React.Component {
  state = {
    loading: false,
  };

  onApprove = async () => {
    this.setState({ loading: true, errorMessage: "" });

    try {
      // create campaign contract instance
      const campaign = Campaign(this.props.address);

      // get all eth accounts that user has connected to metamask wallet
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });

      alert("Approved!");

      // redirect user to same page to force refresh
      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      console.log(err);
      this.props.setErrorMessage(err.message);
    }

    this.setState({ loading: false });
  };

  onFinalize = async () => {
    this.setState({ loading: true, errorMessage: "" });

    try {
      // create campaign contract instance
      const campaign = Campaign(this.props.address);

      // get all eth accounts that user has connected to metamask wallet
      const accounts = await web3.eth.getAccounts();

      // only campaign manager can finalize request (i.e. send money to recipient)
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });

      alert("Finalized!");

      // redirect user to same page to force refresh
      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      console.log(err);
      this.props.setErrorMessage(err.message);
    }

    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, address, approversCount } = this.props;
    const { loading } = this.state;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      // positive = highlights row green if value is true
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>

        {/* approvalCount = number of donators who have approved this request */}
        {/* approversCount = total number of donators of this campaign */}
        <Cell>
          {request.approvalCount} / {approversCount}
        </Cell>

        <Cell>
          {/* only show button if request has not been finalized */}
          {request.complete ? null : (
            <Button
              color="green"
              basic
              onClick={this.onApprove}
              loading={loading}
              disabled={loading}
            >
              {/* only donators can execute this- approves request to spend money */}
              Approve
            </Button>
          )}
        </Cell>

        <Cell>
          {request.complete ? null : (
            <Button
              color="teal"
              basic
              disabled={loading}
              onClick={this.onFinalize}
            >
              {/* only campaign manager can execute this- sends money to recipient */}
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
