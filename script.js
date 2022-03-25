'use strict';

//------------------------------------------------ BANKIST APP

// Data (users & their info)
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//------------------------------------------------ LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//------------------------------------------------ ARRAY METHODS

let array = ['a', 'b', 'c', 'd', 'e'];

// --- slice()
// accessor
// copies a portion of an array to a new array

console.log(array.slice(2)); // (3) ['c', 'd', 'e']
console.log(array.slice(2, 4)); // (2) ['c', 'd']

// copies from the end
console.log(array.slice(-2)); // (2) ['d', 'e']

// last element of the array
console.log(array.slice(-1)); // ['e']

// everything except
console.log(array.slice(1, -2)); // (2) ['b', 'c']

// shallow copy
console.log(array.slice()); // (5) ['a', 'b', 'c', 'd', 'e']
console.log([...array]); // (5) ['a', 'b', 'c', 'd', 'e']

// --- splice()
// mutator
// adds or removes an item from any position in an array, can be simultaneously

// console.log(array.splice(2));
// console.log(array);

// (3) ['c', 'd', 'e'] = what is deleted
// (2) ['a', 'b'] = what is left from the original array

// remove last element
console.log(array.splice(-1));
console.log(array);

// ['e'] = deleted
// (4) ['a', 'b', 'c', 'd'] = what is left from the original array

// starting from position 1, take out 2 elements
console.log(array.splice(1, 2)); // (2) ['b', 'c'] = deleted

// --- reverse()
// mutator
// reverses the order of elements in the array

const arr = ['j', 'i', 'h', 'g', 'f'];

console.log(arr.reverse()); // (5) ['f', 'g', 'h', 'i', 'j']
console.log(arr);

// --- concat()
// accessor
// merges two or more arrays to a new array

const letters = array.concat(arr);

console.log(letters); // (7) ['a', 'd', 'f', 'g', 'h', 'i', 'j']
console.log([...array, ...arr]);

// --- join()
// accessor
// converts all the elements of an array into a new string

console.log(letters.join('-')); // a-d-f-g-h-i-j

// -------- at()

const atArr = [12, 34, 56];

// traditional way to take value out
console.log(atArr[0]); // 12

// ES2022
console.log(atArr.at(0)); // 12

// get last element of array
console.log(atArr[atArr.length - 1]); // 56

console.log(atArr.slice(-1)); // [56], you get copy of array
console.log(atArr.slice(-1)[0]); // 56, [] gets the value out

console.log(atArr.at(-1)); // 56
console.log(atArr.at(-2)); // 34

// works on strings
console.log('mari'.at(2)); // r
console.log('jonas'.at(5)); // undefined
console.log('jonas'.at(3)); // a

// get last character of string
console.log('jonas'.at(-1)); // s
