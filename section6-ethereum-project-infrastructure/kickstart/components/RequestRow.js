import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import {
  getRevertReason,
  metaMaskIsInstalled,
  connectedToCorrectNetwork,
} from "../utils";

class RequestRow extends React.Component {
  state = {
    loading: false,
    loadingApprove: false, // for determining which button to show loading animation when clicked
  };

  validMetaMaskNetwork = async () => {
    if (!metaMaskIsInstalled()) {
      this.props.setErrorMessage("You must have MetaMask installed!");
      return false;

      // if user isn't connected to Rinkby Test Netowork, display error and exit function
    } else if (!(await connectedToCorrectNetwork())) {
      this.props.setErrorMessage(
        "You must be connected to the Rinkby Test Network!"
      );
      return false;
    }
    return true;
  };

  handleError = async (err) => {
    let errorReason;
    if (err.receipt) {
      let transactionHash = err.receipt.transactionHash;
      errorReason = await getRevertReason(transactionHash);
    }
    this.props.setErrorMessage(errorReason || err.message);
  };

  onApprove = async () => {
    if (!(await this.validMetaMaskNetwork())) return;

    this.setState({ loading: true, errorMessage: "", loadingApprove: true });

    try {
      // create campaign contract instance
      const campaign = Campaign(this.props.address);

      // get all eth accounts that user has connected to metamask wallet
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });

      this.props.showSuccessModal("approved");
    } catch (err) {
      console.log(err);

      await this.handleError(err);
    }

    this.setState({ loading: false, loadingApprove: false });
  };

  onFinalize = async () => {
    if (!(await this.validMetaMaskNetwork())) return;
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

      this.props.showSuccessModal("finalized");
    } catch (err) {
      console.log(err);
      await this.handleError(err);
    }

    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, address, approversCount } = this.props;
    const { loading, loadingApprove } = this.state;
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
              loading={loading && loadingApprove}
              disabled={loading || request.approvalCount / approversCount > 0.5}
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
              loading={loading && !loadingApprove}
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
