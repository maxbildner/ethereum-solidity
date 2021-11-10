import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import React, { useEffect, useState } from "react"
import factory from '../ethereum/factory';



class CampaignIndex extends React.Component {

  // STATIC keyword = defines a class function (rather than instance method)
  // this function runs once on server (do this instead of fetching data in componentDidMount)
  static async getInitialProps() {

    // get array of addresses of all deployed campaigns
    const campaigns = await factory.methods.getDeployedCampaigns().call()

    // object is going to be provided to component as props
    return { campaigns: campaigns };
  }

  // runs once after initial mount
  // async componentDidMount() {
  //   // get array of addresses of all deployed campaigns
  //   const campaigns = await factory.methods.getDeployedCampaigns().call()
  //   console.log(campaigns);
  // }
  

  render() {
    return(
      <React.Fragment>
        <h1>This is campaign list page!!</h1>
        {/* <p>{this.props.campaigns[0]}</p> */}
        <p>{this.props.campaigns[0]}</p>
      </React.Fragment>
    )
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