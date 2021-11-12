import React, { useEffect, useState } from "react";
import factory from "../ethereum/factory";
// import "semantic-ui-css/semantic.min.css";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
// import "../styles/index.css";  // can't do this with Next.js!!

class CampaignIndex extends React.Component {
  // STATIC keyword = defines a class function (rather than instance method)
  // this function runs once on server (do this instead of fetching data in componentDidMount)
  static async getInitialProps() {
    // get array of addresses of all deployed campaigns
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    // object is going to be provided to component as props
    return { campaigns: campaigns };
  }

  // use above function (getInitialProps) instead of this
  // runs once after initial mount
  // async componentDidMount() {
  //   // get array of addresses of all deployed campaigns
  //   const campaigns = await factory.methods.getDeployedCampaigns().call()
  //   console.log(campaigns);
  // }

  renderCampaigns() {
    // each object represents a single card from semantic-ui library
    const items = this.props.campaigns.map((address, idx) => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true, // cards will stretch entire width of container
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      // all of jsx between Layout tags are passed into layout component as a property called "children"
      <Layout>
        {/* <p>{this.props.campaigns[0]}</p> */}
        <h3>Open Campaigns</h3>
        <Button
          content="Create Campaign"
          icon="add circle" // + with circle around it
          // primary={true} == same as below
          primary // blue color
          floated="right" // css- float: right
        />
        <div>{this.renderCampaigns()}</div>
      </Layout>
    );
  }
}

// NOT WORKING- Functional Component (don't know how to use syntax for static in functional components)
// const CampaignIndex = () => {

//   // STATIC keyword = defines a class function (rather than instance method)
//   static async getInitialProps = () => {

//   }

//   // runs once after initial mount
//   useEffect(async() => {

//     // get array of addresses of all deployed campaigns
//     const campaigns = await factory.methods.getDeployedCampaigns().call()
//     console.log(campaigns);

//   }, []);

//   return(
//     <h1>This is campaign list page!!</h1>
//   )
// }

export default CampaignIndex;
