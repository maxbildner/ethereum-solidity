/// specify Solidity version our code is written in
/// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;  


// define a new contract called Inbox. Similar to defining a class in OOP
contract Lottery {
    
  // create a storage variable called manager, type address, that is public (easier to access)
  // - STORAGE VARIABLE = one that's stored with the contract on the blockchain (persists unlike a LOCAL VARIABLE)
  address public manager;
  // - PUBLIC = anyone in the world (with an ethereum account) can access
  //   - creating a public storage variable automatically creates a getter method
  //   - similar to an Instance variable in OOP

  // create a storage variable called players, which is an array of addresses
  address[] public players;
  
  // create a CONSTRUCTOR FUNCTION called Lottery
  // - if function name is same as class name, then we have a constructor function (like in OOP)
  // - invoked automatically once when we deploy our contract to the blockchain
  function Lottery() public {
      
    // msg.sender = whenever creates an instance of this Contract, we'll take their address and store it
    manager = msg.sender;
  }
    
  // GLOBAL MESSAGE OBJECT (MSG) =
  // - properties on it like who sent the transaction to the network, and details about the transaction
  // - global variable that's available to any function
  // - MSG PROPERTIES:
  //   1) msg.data = includes contract source code (for contract creation) and any arguments of functions 
  //   2) msg.gas = amount of gas available to us to run our code (rarely used)
  //   3) msg.sender = address of the account that started the function invokation 
  //   4) msg.value = amount of ether (in wei) that was sent along with the function invokation
    
    
  // create a method of type PAYABLE
  // - PAYABLE = when someone calls this function they might send ether
  function enter() public payable {

    // enforce a rule that if you want to enter, you need to send .01 ether
    require(msg.value > .01 ether);
    // - msg.value is in wei, .01 ether converts .01 ether to wei
    // REQUIRE(bool expression)
    //  - if the bool expression = false, the entire function stops and exits!!
    
    // add the address of the sender to the players array
    players.push(msg.sender);
  }
    
    
  // create method that returns an array of addresses
  function getPlayers() public view returns(address[]) {
    return players;
  }
}