// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//   Graph of inheritance
//       A   parent
//      / 
//     B     child


contract A {
    function foo() pure public virtual returns (string memory) {
        return "A";
    }
}

// Contracts inherit other contracts by using the keyword 'is'.
contract B is A {
    // B.foo => B
    function foo() pure public override returns (string memory) {
        return "B";
    }
}

// NOTES
// 1) VIRTUAL keyword
// - Ex. function foo() pure public virtual returns (string memory) {
// - a function with this "virtual" keyword will allow a child contract 
//   to override this method
// - "override" keyword needs to be present in child function that overrides parent
// - this allows you to write your own method that overrides any parent methods of the same name

// 2) OVERRIDE keyword
// - Ex. function foo() pure public override returns (string memory) {
// - when you want child method to overide parent method
// - method names/parameters and keywords have to be the same!
// - if you don't have this keyword, you will get TypeError during compilation!

// Resources:
// - https://medium.com/upstate-interactive/solidity-override-vs-virtual-functions-c0a5dfb83aaf
