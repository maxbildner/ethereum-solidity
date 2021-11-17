import React from "react";
import Layout from "../../../components/Layout";
import { Button, Table, Message } from "semantic-ui-react";
import { Link } from "../../../routes"; // configuration object from next-routes library
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestsIndex extends React.Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    // create instance of campaign contract
    const campaign = Campaign(address);

    // get total number of requests that have been created
    const requestCount = await campaign.methods.getRequestsCount().call();

    // get total number of donators of campaign
    const approversCount = await campaign.methods.approversCount().call();

    // create array of promise objects, then call all of them asynchronously
    const requests = await Promise.all(
      // create an array of requestCount length, then fill it with the result of mapping function
      Array(parseInt(requestCount)) // convert requestCount string to number
        .fill() // fill array with undefined elements
        .map((_element, idx) => {
          // mapping function returns async function that gets struct from contract
          return campaign.methods.requests(idx).call();
        })
    );

    // console.log(requests); //=>
    // [
    //   Result {
    //     '0': 'buy batteries',
    //     '1': '1000000000000000',
    //     '2': '0x9c4Cdaa24e16B08c0851F29038D86243657655F4',
    //     '3': false,
    //     '4': '0',
    //     description: 'buy batteries',
    //     value: '1000000000000000',
    //     recipient: '0x9c4Cdaa24e16B08c0851F29038D86243657655F4',
    //     complete: false,
    //     approvalCount: '0'
    //   },
    //   Result {
    //     '0': 'buy more batteries',
    //     '1': '10000000000000000',
    //     '2': '0x9c4Cdaa24e16B08c0851F29038D86243657655F4',
    //     '3': false,
    //     '4': '0',
    //     description: 'buy more batteries',
    //     value: '10000000000000000',
    //     recipient: '0x9c4Cdaa24e16B08c0851F29038D86243657655F4',
    //     complete: false,
    //     approvalCount: '0'
    //   }
    // ]

    return { address, requests, approversCount, requestCount };
  }

  state = { errorMessage: "" };

  setErrorMessage = (message) => {
    this.setState({ errorMessage: message });
  };

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
          id={index}
          setErrorMessage={this.setErrorMessage}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back to Campaign Details</a>
        </Link>

        <h3>Request List</h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: "10px" }}>
              Add Request
            </Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (ETH)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>

        <Message
          hidden={!this.state.errorMessage}
          error
          header="Error:"
          content={this.state.errorMessage}
        />

        <div>Found {this.props.requestCount} Request(s)</div>
      </Layout>
    );
  }
}

export default RequestsIndex;
