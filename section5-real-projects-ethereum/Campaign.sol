/// specify Solidity version our code is written in
/// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;  

// kick starter campaign
contract Campaign {
    
  // define a type request (not an instance of a request)
  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
  }
  
  // create an array of request objects
  Request[] public requests;
  
  // address of person who created the kickstarter campaign
  address public manager;
  
  // min amount of wei someone must give to the campaign
  uint public minimumContribution;
  
  // people who have contributed money to the campaign
  address[]public approvers;
  
  // create a modifier called restricted
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
  
  
  // minimum (wei)
  function Campaign(uint minimum) public {
      
    // msg = global variable with sender (address) of who sent the transaction
    manager = msg.sender;
    
    minimumContribution = minimum;
  }
  
  
  // called whenever someone wants to send money to the contract
  function contribute() public payable {
      
    // msg.value = amount in wei someone sent in the transaction
    require(msg.value > minimumContribution);
    
    approvers.push(msg.sender);
  }
  
  
  // called by manager to create new spending request
  function createRequest(string description, uint value, address recipient) 
    public restricted {
    
    // create a new variable called newRequest, of type Request
    // - must add memory keyword below!! or else we'll get warning
    // Request newRequest = Request({
          
      Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false
    });
    
    // alternative syntax (not recommended because order matters) to above
    // Request(description, value, recipient, false);
    
    requests.push(newRequest);
  }
}