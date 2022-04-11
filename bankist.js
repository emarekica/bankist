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

// movements: [200, 450, -400, 3000, -650, -130, 70, 1300]

// ---------------------------------------- display movements

//// function called later in event handler
const displayMovements = function (movements) {
  // empty the container to add new elements
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    // check if deposit or withdrawal
    const depositType = mov > 0 ? 'deposit' : 'withdrawal';

    // creating one row of movements
    const html = `       
      <div class="movements__row">
        <div
          class="movements__type movements__type--${depositType}">
          ${i + 1} ${depositType}
        </div>
        <div class="movements__value">${mov}€</div>
  <   /div>`;

    // attach HTML template to movements element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML); // displays complete HTML

// ---------------------------------------- calculate balance
// ---------------------------------------- display balance
// calculating current balance
// printing current balance to the "label balance" ("balance__value")

//// function called later in event handler
const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  // store the balance value into the account object
  account.balance = balance;

  labelBalance.textContent = `${balance}€`;
};

// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// ---------------------------------------- computing usernames

// creating a new property on account objects: "username"

const createUsernames = function (accs) {
  // side-effects: mutating original array
  accs.forEach(function (acc) {
    acc.username = acc.owner // new property on objects
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

// uses currentAccount, here named "acc"
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// ---- chaining methods
// ---------------------------------------- STATISTICS
// ---------------------------------------- calculate summary
// ---------------------------------------- display summary

// IN = income = all deposits
// OUT = outcome = all withdrawals
// interest

//// function called later in event handler
const calcDisplaySummary = function (account) {
  // in = labelSumIn
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // put it inside HTML element: .summary__value--interest = labelSumIn
  labelSumIn.textContent = `${income}€`;

  // out = labelSumOut
  const outcome = account.movements
    .filter(mov => (mov < 0 ? true : false))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  // interest = labelSumInterest
  // 1.2% of deposited amount, added with each deposit (1.2/100 = 0.012)
  const interest = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => deposit * account.interestRate)
    // bank will pay interest if it is >= 1€
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// bank will pay interest if it is >= 1€

// // -----------------------------------------------------------

console.log(accounts);

// selecting accounts by name
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

for (let acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    acc = account2;
  }
}

console.log(account2);

// // ---------------------------------------- IMPLEMENTING LOGIN

// --- event listener >> login__btn = btnLogin
// --- username: login__input--user = inputLoginUsername
// --- pin: login__input--pin = inputLoginPin

// ------------------------------------------- event handlers

let currentAccount;

// e = event

btnLogin.addEventListener('click', function (e) {
  // prevents form from submitting
  e.preventDefault();

  // find account with user name that user inputed
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // check if PIN is correct
  // optional chaining used to check if currentAccount exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // ---- if PIN is correct, do this:

    // 1: Display UI and "welcome" msg
    // .welcome; "Login to get started" = labelWelcome
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // remove the focus (cursor) from input field
    inputLoginPin.blur();

    // .app contains opacity to change visibility = containerApp
    containerApp.style.opacity = 100;

    // update UI (summary and balance)
    updateUI(currentAccount);
  }
});

// // ---------------------------------------- IMPLEMENTING TRANSFERS

// --- event listener >> form-btn = btnTransfer
// --- "transfer to" = form__input--to = inputTransferTo
// --- "amount" = form__input--amount = inputTransferAmount

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // input data
  // use it to find account object to which to transfer
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  // clean Transfer input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  // if amount is a positive number
  // if receiver account exists
  // if current user has enough money (at least as the amount he wants to transfer)
  // if we can transfer the money to our account

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    // add negative movement to current user (withdrawal)
    currentAccount.movements.push(-amount);

    // add positive movement to recipient (deposit)
    receiverAccount.movements.push(amount);

    // update UI (summary and balance)
    updateUI(currentAccount);
  }
});

// // ---------------------------------------- DELETING ACCOUNT

// --- event listener >> form__btn--close = btnClose
// --- "confirm user": .form__input--user = inputCloseUsername
// --- "confirm PIN": .form__input--pin = inputClosePin

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if credentials are correct
  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // delete user from data
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // start, deleteCount
    accounts.splice(index, 1);

    // logout user = hide UI
    containerApp.style.opacity = 0;

    // logout timer expires
  }

  // clear input fields >> you won't be able to login anymore
  inputCloseUsername.value = inputClosePin.value = '';
});
