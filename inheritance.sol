pragma solidity >=0.7.0 <0.9.0;

// https://www.youtube.com/watch?v=GnztHR8-1o8
//   Graph of inheritance
//       A
//      / \
//     B   C
//   / \  /
//   F  D,E

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
    function foo() public pure virtual override returns (string memory) {
        return "C";
    }
}

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