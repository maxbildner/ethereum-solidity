import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends React.Component {
  static async getInitialProps(props) {
    // console.log(props.query.address); // address = from wild card variable in url in routes.js file

    // grab web3 instance of a campaign contract given a certain address
    const campaign = Campaign(props.query.address);

    // get info about a campaign
    const summary = await campaign.methods.getSummary().call();

    // console.log(summary); //=>
    // {
    //   '0': '100',    // minContribution
    //   '1': '0',      // campaign balance
    //   '2': '0',      // number of requests (from manager to spend donation money)
    //   '3': '0',      // number of donators
    //   '4': '0xE2fda73B817036CA5003e8E5080EF21E7B60c858' // address of manager
    // }

    return {
      minContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address, // address of campaign smart contract
    };
  }

  renderCards() {
    const { minContribution, balance, requestsCount, approversCount, manager } =
      this.props;

    // see semantic-ui react library docs- for rendering card components
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" }, // optional to customize style
      },
      {
        header: minContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver (donator)",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request by the manager tries to withdraw money from the smart contract (balance)." +
          "Requests must be approved by donators",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            {/* widths are proportions, so render cards will have about 62% width (10/16) */}
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            {/* need grid.col or else button margin left will be off */}
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
