import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";

// import instance of campaign smart contract
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import {
  isNumber,
  metaMaskIsInstalled,
  connectedToCorrectNetwork,
  getRevertReason,
} from "../utils";

const ContributeForm = (props) => {
  const [value, setValue] = useState(""); // ether to contribute
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // for showing loading animation on button

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    let minContributionEth = web3.utils.fromWei(props.minContribution, "ether"); // convert from wei to ether

    try {
      if (value < minContributionEth) {
        setErrorMessage(`${minContributionEth} ETH Minimum Contribution!`);

        // display error if user doesn't have metamask installed
      } else if (!metaMaskIsInstalled()) {
        setErrorMessage("You must have MetaMask installed!");

        // if user isn't connected to Rinkby Test Netowork, display error and exit function
      } else if (!(await connectedToCorrectNetwork())) {
        setErrorMessage("You must be connected to the Rinkby Test Network!");
      } else {
        const campaign = Campaign(props.address);

        // get users ETH account connected with their metamask wallet
        const accounts = await web3.eth.getAccounts();

        // donate money to campaign
        await campaign.methods.contribute().send({
          from: accounts[0], // address of user who wants to donate money
          value: web3.utils.toWei(value, "ether"), // wei to donate
        });

        // redirect user to same page to force refresh
        Router.replaceRoute(`/campaigns/${props.address}`);

        setSuccessMessage("Contribution Successful!");
      }
    } catch (err) {
      console.log(err);

      let errorReason;
      if (err.receipt) {
        let transactionHash = err.receipt.transactionHash;
        errorReason = await getRevertReason(transactionHash);
      }

      setErrorMessage(errorReason || err.message);
    }

    setLoading(false);
    setValue("");
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage} success={!!successMessage}>
      <Form.Field>
        <label>
          Amount to Contribute (
          {web3.utils.fromWei(props.minContribution, "ether")} ETH Min)
        </label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);

            if (!isNumber(e.target.value)) {
              setErrorMessage("Must enter a valid number");
            } else {
              setErrorMessage("");
              setSuccessMessage("");
            }
          }}
          disabled={loading}
        />
      </Form.Field>
      <Message error header="Error:" content={errorMessage} />
      <Message
        success
        header="Success:"
        content={successMessage}
        onDismiss={() => setSuccessMessage("")}
      />
      <Button
        primary // color blue
        loading={loading}
        disabled={loading || !isNumber(value)}
      >
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
