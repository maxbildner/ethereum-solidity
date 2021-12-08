/// specify Solidity version our code is written in
/// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;  

// FACTORY campaign
// - contract that deploys another contract
// - abstracts main campaign code so user can't modify it
contract CampaignFactory {
  
  // holds list of addresses of all deployed campaigns
  address[] public deployedCampaigns;
  
  // minimum = min contribution when people donate
  function createCampaign(uint minimum) public {
    
    // deploy new contract to the blockchain
    // - msg.sender = address of person creating the campaign (i.e. the manager)
    address newCampaign = new Campaign(minimum, msg.sender);
    
    deployedCampaigns.push(newCampaign);
  }
  
  
  // getter method, that returns array of addresses (campaign contracts)
  // VIEW = no data of the contract is modified by this function
  function getDeployedCampaigns() public view returns (address[]){
    return deployedCampaigns;
  }
}


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

    // NOTE* we do NOT have access to this method approvals below because we can't retrieve an entire mapping!
    // - we can only access this method from within this contract!!
    mapping(address => bool) approvals; // people (address) who have approved request
  }
  
  // create an array of request objects
  // - we cannot call this method without passing in a specific index!
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

  // total number of donators- people in approvers object (mapping)
  uint public approversCount;

  // how much money (Wei) people have donated to this campaign
  uint public totalContributions; 

  // create a modifier called restricted
  modifier restricted() {
    require(msg.sender == manager, "You must be the manager to execute this function!");
    _;
  }
  
  
  // minimum (wei) contribution when people donate
  // - returns address of the newly created campaign (? default return value of all constructors?!)
  function Campaign(uint minimum, address senderAddress) public {

    require(minimum >= 100, "Minimum campaign contribution must be 100 Wei");

    // msg = global variable with sender (address) of who sent the transaction
    // don't want below because msg.sender will refer to address of Factory Campaign!
    // manager = msg.sender;
    
    manager = senderAddress;
     
    minimumContribution = minimum;
  }
  
  
  // called whenever someone wants to send money to the contract (i.e. donate)
  function contribute() public payable {
      
    // msg.value = amount in wei someone sent in the transaction
    require(msg.value >= minimumContribution, "Minimum contribution not met!");

    // user can contribute multiple times, but can only vote once!
    // if user hasn't already contributed
    if (!approvers[msg.sender]) {

      // increment number of people who have donated by 1
      approversCount++;
    } 

    // add key to approvers mapping of msg.sender, with a value of true
    approvers[msg.sender] = true;
    // - ? the address msg.sender does NOT get stored in the mapping! only the value true?
     
    totalContributions += msg.value;
  }
  
  
  // called by manager to create new spending request
  function createRequest(string description, uint value, address recipient) 
    public restricted {
    // value = amount campaign manager wants to spend on this request
    // recipient = address of vendor manager wants to send money to

    // prevent manager from creating request to send money to themselves
    require(recipient != manager, "Recipient of request cannot be the manager!");

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
  function approveRequest(uint index) public {
    // want to manipualte request variable, so use keyword "storage"
    // - saving reference to request so we don't have to keep calling requests[index]
    Request storage request = requests[index];

    // require person calling this method to be a donator to campaign
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
  // - manager can call this to get money sent to vendor
  // - index = index of requests array that the manager wants to finalize
  function finalizeRequest(uint index) public restricted {
      
    // create local variable to represent request object
    // - STORAGE = makes variable point directly at exact same location 
    //   that numbers variable is pointing at (see slide 5-11-127)
    Request storage request = requests[index];
      
    // make sure request is NOT already marked as complete
    require(!request.complete, "Request is already complete!");
    
    // more than 50% of donators must have approved this request
    require(request.approvalCount > approversCount/2, "More than 50% of donators must have approved this request!");
    
    // to help front end error handling (not needed, since we will revert if balance not sufficient anyuway)
    require(this.balance >= request.value, "Campaign balance not enough to send to recipient!");

    // send money to vendor
    request.recipient.transfer(request.value);

    // update the complete flag to be true after paying vendor
    request.complete = true;
  }


  // returns a bunch of info (1 call to contract better than making 4 separate calls)
  // returns object (looks like array with keys,0,1,2,3,4 and values below)
  function getSummary() public view returns (
    uint, uint, uint, uint, address
  ) {
    return(
      minimumContribution,
      this.balance,    // campaign balance (balance is a built in attribute on contract)
      requests.length,
      approversCount,
      manager
    );
  }

  function getRequestsCount() public view returns(uint) {
    return requests.length;
  }
}