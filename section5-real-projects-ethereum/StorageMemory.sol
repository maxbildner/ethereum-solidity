// From Section 5, Lesson 127 UDEMY COURSE- STORAGE VS MEMORY
pragma solidity ^0.4.17;

contract Numbers {
  int[] public numbers;
  
  function Numbers() public {
    numbers.push(20);
    numbers.push(32);
    
    // will get warning below- variable is declared as a storage pointer!!
    // int[] myArray = numbers;
    // - will still run and act like a storage variable
    
    // 1) 
    // to avoid warning  add the keyword "storage"
    int[] storage myArray = numbers;
    // STORAGE
    // - changes how variable myArray works
    // - makes variable point directly at exact same location 
    //   that numbers variable is pointing at (see slide 5-11-127)
    
    myArray[0] = 1;
    // After we deploy contract, when we access numbers:
    // accesing numbers[0] => we'll get back 1 !!!!!!!
    // accesing numbers[1] => we'll get back 32
    
    // 2) 
    // MEMORY keyword
    // int[] memory myArray = numbers;
    // - solidity would make a copy of the numbers array and put it into memeroy
    // - then myArray would no longer point to the numbers in storage
    // - ? is the copy a deep copy?
    
    // myArray[0] = 1;
    // After we deploy contract, when we access numbers:
    // accesing numbers[0] => we'll get back 20 !!!!!!!
    // accesing numbers[1] => we'll get back 32
    
    changeArray(numbers);
  }
  
  
  // passing variables into functions (automatically memory!) will make a copy
  // function changeArray(int[] myArray) private {
  //   // this will NOT change the numbers array!
  //   myArray[0] = 1;
  // }
      
      
  // below will not make a copy!!
  function changeArray(int[] storage myArray) private {
      
    // this will change the numbers array!
    myArray[0] = 1;
  }
}
