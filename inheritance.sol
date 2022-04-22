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


// NOTES
// 1) PURE keyword
// - Ex. function getNumMangoes() public pure virtual returns (uint) {
// - declares that no state will be CHANGED or READ
// - Will get COMPILATION TypeERROR if you:
//   - Access or change a state variable 
//   - Access address(this).balance or <address>.balance.
//   - Access any of the special variable of block, tx, msg 
//     (msg.sig and msg.data can be read) 


// 1) VIRTUAL keyword
// - Ex. function foo() pure public virtual returns (string memory) {
// - a function with this "virtual" keyword will allow a child contract 
//   to override this method
// - "override" keyword needs to be present in child function that overrides parent
// - this allows you to write your own method that overrides any parent methods of 
//   the same name


// 2) OVERRIDE keyword
// - Ex. function foo() pure public override returns (string memory) {
// - when you want child method to overide parent method
// - method names/parameters and keywords have to be the same!
// - if you don't have this keyword, you will get TypeError during compilation!
// - https://www.youtube.com/watch?v=GnztHR8-1o8
