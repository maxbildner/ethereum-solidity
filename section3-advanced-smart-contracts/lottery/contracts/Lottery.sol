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
    require(msg.value > .01 ether, "you must send more than .01 ether");
    // - msg.value is in wei, '.01 ether' converts .01 ether to wei
    // REQUIRE(bool expression, string_reason)
    //  - if the bool expression = false, the entire function stops and exits!!
    
    // add the address of the sender to the players array
    players.push(msg.sender);
  }
    
    
  // create method that returns an array of addresses
  function getPlayers() public view returns(address[]) {
    // VIEW = does not modify the contract (just returns data)

    return players;
  }


  // helper function that generates a pseudo random number
  function random() private view returns(uint256) {
    // - PRIVATE = function can only be called inside this contract (but doesn't mean its secure!!)
    
    // return psedo random number
    uint(keccak256(block.difficulty, now, players));
    // - block.difficulty = global variable (type uint)
    // - now = global variable (type uint) current timestamp as seconds since unix epoch
    //    - same as block.timestamp (removed in solidity ersion 0.7.0)
    // - sha3 ( ) = global function in solidity (instance or type of keccak256 function)
    // - keccak256( ) = global function that is a class of hash functions
    //    - => returns a hash (32 byte array or a 256 bit string)
    //        ex. "0x300330ecd127756b824aa13e843cb1f43c473cb22eaf3750d5fb9c99279af8c3"
    // - uint( string )
    //    - => returns uinsigned integer
    //    - we can convert the output of keccak256 (array or string) into an integer by
    //      passing the output into uint( )
  }


  function pickWinner() public restricted{
    // RESTRICTED = 
    // - new type of function type we defined in modifier function
    // - "restricted" could be named anything

    // exit if the person who called this method is NOT the manager
    // require(msg.sender == manager, "You cant call this method unless you're the manager!");  
      
    // create a local variable that's a "random" index of players array
    uint index = random() % players.length;

    // randomly select a player in the player array
    players[index].transfer(this.balance);
    // - address.transfer( wei )
    //    - will take wei from current contract and send it to address
    //    - this.balance = amount of ether that exists in the current contract
    //    - this.balance is deprecated, use address(this).balance

    // reset players array. creates a new dynamic array of addresses, with initial size of 0
    players = new address[](0);
  }

  // MODIFIER 
  //  - whenever we add "resctricted" to a function type definition
  //    we are running the code below
  //  - help us reduce amount of code we have to write (ex. so we don't)
  //    have duplicates of require(msg.sender == manager)
  modifier restricted() {
    require(msg.sender == manager, "You can't call this method unless you're the manager!");
    
    // - for each function we use "restricted" with, solidity will 
    //   take all the code inside modifier and place
    //   it in place of the _ below
    _;
  }
}