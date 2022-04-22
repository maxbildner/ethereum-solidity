// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract A {
    uint public numMangoes; // default value for uints will be 0


    // PURE keyword- CORRECT way
    function getNumMangoes() public virtual pure returns (uint) {
        return 420;
    }

    // PURE keyword- WRONG way #1
    // function getNumMangoes() public pure virtual returns (uint) {
    //     return numMangoes;
    //     // - accessing state variable "numMangoes" will result in compilation 
    //     //   typeError because of "pure" keyword
    // }

    // PURE keyword- WRONG way #2
    // function getNumMangoes() public virtual pure returns (uint) {
    //     uint fruit = numMangoes;
    //     // ^ reading numMangoes will result in Compilation Error
    //     return 420;
    // }

    // VIEW keyword
    function getMangoes() public virtual view returns (uint) {
        return numMangoes;
    }
}

// NOTES
// 1) "pure" keyword
// - Ex. function getNumMangoes() public pure virtual returns (uint) {
// - declares that no state will be CHANGED or READ
// - Will get COMPILATION TypeERROR if you:
//   - Access or change a state variable 
//   - Access address(this).balance or <address>.balance.
//   - Access any of the special variable of block, tx, msg 
//     (msg.sig and msg.data can be read)

// 2) "view" keyword
// - Ex. function getNumMangoes() public pure virtual returns (uint) {
// - declares that function can only READ state variables, but NOT CHANGE them
