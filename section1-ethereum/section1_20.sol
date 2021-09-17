/// specify Solidity version our code is written in
/// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;

// define a new contract called Inbox. Similar to defining a class in OOP
contract Inbox {
    // create a storage variable called message, type string, that is public (easier to access)
    // - STORAGE VARIABLE = one that's stored with the contract on the blockchain (persists unlike a LOCAL VARIABLE)
    string public message;

    // - PUBLIC = anyone in the world (with an ethereum account) can access
    //   - creating a public storage variable automatically creates a getter method like the getMessage one below
    // - similar to an Instance variable in OOP

    // create a CONSTRUCTOR FUNCTION called Inbox, that takes in a string parameter called initialMessage
    // - if function name is same as class name, then we have a constructor function (like in OOP)
    // - invoked automatically once when we deploy our contract to the blockchain
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    // create regular function we can call after our contract has been deployed to the blockchain
    // like a setter method in OOP
    function setMessage(string newMessage) public {
        message = newMessage;
    }

    // FUNCTION TYPES
    // - PUBLIC = anyone in the world (with an ethereum account) can access
    // - PRIVATE = only this contract call this function. (but doesn't mean its secure!!).
    //   - might create private function for helper functions like in OOP
    // - VIEW = the function returns data and does NOT modify the contract's data
    // - CONSTANT = same as VIEW keyword
    // - PAYABLE = when someone calls this function they might send ether
    function getMessage() public view returns (string) {
        // RETURNS = specified type of return value of function. Only used by VIEW or CONSTANT function types
        // - can't return data from a function that modifies our contract
        return message;
    }
}
