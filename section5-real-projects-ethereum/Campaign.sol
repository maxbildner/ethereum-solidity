/// specify Solidity version our code is written in
/// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;  

// kick starter campaign
contract Campaign {
    
  // define a new data type called request (not an instance of a request)
  // STRUCT
  // - defines a new data type 
  // - use . operator to access variable
  struct Request {
    string description;
    uint value;                         // amount manager wants to send vendor (eth?)
    address recipient;                  // vendor who is receiving money
    bool complete;                      // has request been completed (sent?)
    uint approvalCount;                 // number of people who have approved request
    mapping(address => bool) approvals; // people (address) who have approved request
  }
  
  // create an array of request objects
  Request[] public requests;
  
  // address of person who created the kickstarter campaign
  address public manager;
  
  // min amount of wei someone must give to the campaign
  uint public minimumContribution;
  
  // people who have contributed money to the campaign
  // - wrong way to do this because of O(N) search time/high fees of looping through arrays
  // address[]public approvers;

  // create mapping, where keys = addresses of donators, values = booleans of weather they donated to contract
  // - default value for mapping if undefined key is boolean = false
  // - we can NOT iterate through values of mapping, or retrieve entire mapping
  mapping (address => bool) public approvers;

  // number of people in approvers object (mapping)
  uint public approversCount;

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
  
  
  // called whenever someone wants to send money to the contract (i.e. donate)
  function contribute() public payable {
      
    // msg.value = amount in wei someone sent in the transaction
    require(msg.value > minimumContribution);
    
    // add key to approvers mapping of msg.sender, with a value of true
    approvers[msg.sender] = true;
    // - ? the address msg.sender does NOT get stored in the mapping! only the value true?
    
    // increment number of people who have donated by 1
    approversCount++;
  }
  
  
  // called by manager to create new spending request
  function createRequest(string description, uint value, address recipient) 
    public restricted {
    // value = amount campaign manager wants to spend on this request
    // recipient = address of vendor manager wants to send money to

    // create a new variable called newRequest, of type Request
    // - must add memory keyword below!! or else we'll get warning
    // Request newRequest = Request({
          
    Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false,
      approvalCount: 0
      // when we initialize a struct, we only have to provide value types!
      // - no need to initialize mapping type (reference type)
    });
    
    // alternative syntax (not recommended because order matters) to above
    // Request(description, value, recipient, false);
    
    requests.push(newRequest);
  }


  // called by approver (donator) to approve/vote on a specific request
  // index = index of request caller of method is trying to approve
  function approveRequest(uint index) {
    // want to manipualte request variable, so use keyword "storage"
    // - saving reference to request so we don't have to keep calling requests[index]
    Request storage request = requests[index];

    // require person calling this method is a donator to campaign
    // - cheaper/faster than looping through array
    require(approvers[msg.sender], "You must be a donator to this campaign");

    // make sure person calling this method hasn't voted before
    require(!request.approvals[msg.sender], "You have already voted!");
  
    // increment approvalCount for specific request by 1
    request.approvalCount++;

    // caller of approval votes yes on request
    request.approvals[msg.sender] = true;
    // - not voting at all = no vote
  }
  

  // called by manager after request has gotten enough approvals
  // - managerr can call this to get money sent to vendor
  // - index = index of requests array that the manager
  function finalizeRequest(uint index) public restricted {
      
    // create local variable to represent request object
    // - STORAGE = makes variable point directly at exact same location 
    //   that numbers variable is pointing at (see slide 5-11-127)
    Request storage request = requests[index];
      
    // make sure request is NOT already marked as complete
    require(!request.complete, "Request is already complete!");
    
    // more than 50% of donators must have approved this request
    require(request.approvalCount > approversCount/2);
    
    // send money to vendor
    request.recipient.transfer(request.value);
    
    // update the complete flag to be true after paying vendor
    request.complete = true;
  }
}