# Notes - Inheritance in Solidity Smart Contracts
- https://ethereum.stackexchange.com/questions/10126/what-is-is-keyword-in-solidity
- https://docs.soliditylang.org/en/develop/contracts.html#inheritance
- https://solidity-by-example.org/inheritance/

## IS keyword
- used for inheritance
- Ex 1. ```contract B is A```
  - contract B (child) inherits from contract A (parent)
  ```
  Graph of inheritance
      A
     / \
    B   C
   / \ /
  F  D,E

  contract A {
    function foo() public pure virtual returns (string memory) {
        return "A";
    }
  } 

  // Contracts inherit other contracts by using the keyword 'is'.
  contract B is A {
      // B.foo => B
      function foo() public pure virtual override returns (string memory) {
          return "B";
      }
  }

  contract C is A {
      // C.foo => C
      function foo() public pure virtual override returns (string memory) {
          return "C";
      }
  }
  ```
- Ex 2. ```contract D is B, C```
  - contract D (child) inherts from both contracts B and C
  ```
  // Contracts can inherit from multiple parent contracts.
  // When a function is called that is defined multiple times in
  // different contracts, parent contracts are searched from
  // RIGHT TO LEFT, and in DEPTH FIRST SEARCH manner.

  contract D is B, C {
      // D.foo() => "C"
      // since C is the right most parent contract with function foo()
      function foo() public pure override(B, C) returns (string memory) {
          return super.foo();
      }
  }

  contract E is C, B {
      // E.foo() => "B"
      // since B is the right most parent contract with function foo()
      function foo() public pure override(C, B) returns (string memory) {
          return super.foo();
      }
  }
  ```

## virtual overide keyword
- override
  - when you want child method to overide parent method
  - method names/parameters and keywords have to be the same!
  - if you don't have this keyword, you will get TypeError during compilation!
- https://www.youtube.com/watch?v=GnztHR8-1o8
