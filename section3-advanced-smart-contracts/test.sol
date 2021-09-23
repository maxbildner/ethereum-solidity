// NOTES FROM SECTION 3, LESSON 72 & 74- OVERVIEW OF ARRAYS 

// specify Solidity version our code is written in
// - use compiler version 0.4.17 (^ means won't work for versions above 0.5 or newer)
pragma solidity ^0.4.17;  


contract Test {
  // create a dynamic sized array with unsigned integers
  uint[] public myArray;
  // - PUBLIC = anyone in the world (with an ethereum account) can access
    //   - creating a public storage variable automatically creates a getter method
    //   - similar to an Instance variable in OOP
    //   - NOTE! array getter methods created from storage variables do NOT
    //     return the entire array!!! they take in an index and return an element
    //     at that index

  // create a dynamic array of strings called myArray2
  string[] public myArray2;

  // constructor function
  function Test() public {
    myArray.push(1);
    myArray.push(10);
    myArray.push(30);
    myArray.push("yo");
  }

  // create method that returns the entire array myArray
  function getMyArray() public view returns(uint[]) {
    // - VIEW = does not modify the contract (just returns data)
    // - only works for arrays of simple data types like integers / booleans.
    //   It would NOT work for an array of arrays or an array of structs

    return myArray;
  }

  // WILL GET A COMPILE ERROR HERE BELOW
  function getMyArray2() public view returns (string[]) {
    return myArray;
  }

  function getArrayLength() public view returns (uint) {
    return myArray.length;
  }

  function getFirstElement() public view returns (uint) {
    return myArray[0];
  }
}
