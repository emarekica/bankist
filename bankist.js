'use strict';

// ---------------------------------- BANKIST APP

//

// ---------------------------------- DATA

// movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-31T17:01:17.194Z',
    '2022-05-01T23:36:17.929Z', // 3 days ago
    '2022-06-03T10:51:36.790Z', // yesterday
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//

// ---------------------------------- ELEMENTS

//

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

//

// ---------------------------------- DISPLAY MOVEMENTS

// ---- .movements = containerMovements
// .movements__row

// function called later in event handler
// adjusted to support sorting

// ---------------------------------- FORMAT DATE

//

// formats date
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 25));

  // calculating days passed
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, "0");
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// formats currencies
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  // empty the container to add new elements
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    // check if deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // loop over movementDates to get the date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovement = formatCurrency(mov, acc.locale, acc.currency);

    // creating one row of movements
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div>
    `;

    // attach HTML template to movements element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//

// ---------------------------------------- CALCUALTE BALANCE
// ---------------------------------------- DISPLAY BALANCE

// calculating current balance
// printing current balance to: .balance__value = "labelBalance"

//

const calcDisplayBalance = function (acc) {
  // store the balance value into the account object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//

// ---------------------------------------- STATISTICS
// ---------------------------------------- calculate summary
// ---------------------------------------- display summary

//

// IN = income = all deposits = .summary__value--in = "labelSumIn"
// OUT = outcome = all withdrawals = .summary__value--out = "labelSumOut"
// interests = .summary__value--interest = "labelSumInterest"

//

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // put it inside HTML element: .summary__value--interest = labelSumIn
  // `${incomes.toFixed(2)}€`;

  labelSumIn.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );

  // out = labelSumOut
  // `${Math.abs(out).toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );

  // interest = labelSumInterest
  // 1.2% of deposited amount, added with each deposit (1.2/100 = 0.012)
  // `${interest.toFixed(2)}€`;

  const interest = acc.movements
    // bank will pay interest if it is >= 1€
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//

// ---------------------------------------- COMPUTING USERNAMES

// creating a new property on account objects: "username"

//

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// uses currentAccount, here named "acc"
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// selecting accounts by name
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for (let acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     acc = account2;
//   }
// }

// console.log(account2);

//

// -------------------------------------------- LOGIN

// --- event listener >> login__btn = btnLogin
// --- username: login__input--user = inputLoginUsername
// --- pin: login__input--pin = inputLoginPin

//

// global variables
let currentAccount;
let timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100; // makes UI visible

//

// -------------------------------- DISPLAY CURRENT USER

//

// --- .timer = labelTimer >> where time is printed

const logOutTimer = function () {
  const tick = function () {
    // convert to min:sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each callback call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When time = 0 sec, stop timer
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      // stop timer from being -num
    }

    // Remove 1 sec from each function all
    // time = time - 1;
    time--;
  };

  // Set time to 5 min
  let time = 120;

  tick();
  // Call timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  // find account with user name that user inputed
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // check if PIN is correct
  // optional chaining used to check if currentAccount exists
  if (currentAccount?.pin === +inputLoginPin.value) {
    // if PIN is correct, do this:

    // 1: Display UI and "welcome" msg
    // .welcome; "Login to get started" = labelWelcome
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create Current balance Date & Time
    const now = new Date(); // = right now

    // const day = `${now.getDate()}`.padStart(2, "0");
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getHours()}`.padStart(2, 0);

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // "long", 2-digit
      year: 'numeric',
      // weekday: "short", // "short", "narrow"
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // day/month/year
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // remove the focus (cursor) from input field
    inputLoginPin.blur();

    // .app contains opacity to change visibility = containerApp
    containerApp.style.opacity = 100;

    // TIMER
    // if there already is a timer from other user, clear it
    if (timer) clearInterval(timer);

    // set new timer for the new user
    timer = logOutTimer();

    // update UI (summary and balance)
    updateUI(currentAccount);
  }
});

//

// ------------------------------- IMPLEMENTING TRANSFERS

// --- event listener >> form__btn = btnTransfer
// --- "transfer to" = form__input--to = inputTransferTo
// --- "amount" = form__input--amount = inputTransferAmount

//

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // input data
  // use it to find account object to which to transfer
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  // clean Transfer input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  // if amount is a positive number
  // if receiver account exists
  // if current user has enough money (at least as the amount he wants to transfer)
  // if we can transfer the money to our account

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // TRANSFER
    // add negative movement to current user (withdrawal)
    currentAccount.movements.push(-amount);

    // add positive movement to recipient (deposit)
    receiverAcc.movements.push(amount);

    // ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // UPDATE UI (summary and balance)
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = logOutTimer();
  }
});

//

// ---------------------------------------- REQUEST A LOAN

// ---- event listener >> .form__btn--loan = btnLoan
// ---- "amount" = form__input--loan-amount = inputLoanAmount

// bank only grants a loan if there is at least one deposit with at least 10% of the requested loan amount

//

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // get the inputed/requested amount
  const amount = Math.floor(inputLoanAmount.value);

  // any deposit > 10% of requested amount?
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add positive movement to the current user
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = logOutTimer();
    }, 2500);
  }

  // clear input field
  inputLoanAmount.value = '';
});

//

// ---------------------------------------- DELETING ACCOUNT

// --- event listener >> form__btn--close = btnClose
// --- "confirm user": .form__input--user = inputCloseUsername
// --- "confirm PIN": .form__input--pin = inputClosePin

//

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if credentials are correct
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // delete user from data
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // start, deleteCount
    accounts.splice(index, 1);

    // logout user = hide UI
    containerApp.style.opacity = 0;
  }

  // clear input fields >> you won't be able to login anymore
  inputCloseUsername.value = inputClosePin.value = '';
});

//

// ---------------------------------------- SORT BUTTON

// ---- .btn--sort = btnSort

//

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//

// ----------- calculate overall movements of all accounts

//

// take out deeply nested movements
const allMovements = accounts.map(acc => acc.movements);
console.log(allMovements);

// put all in 1 arr
const allAccMovements = allMovements.flat();
console.log(allAccMovements);

// sum them
const overallBalance = allAccMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance); // 17840

// chaining

const overall = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overall); // 17840

// flatMap() = map() + flat()

const overall2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overall2); // 17840

//

// -------- selecting UI stored data and converting an array

//

labelBalance.addEventListener('click', function () {
  // has 2 arguments
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    domElement => +domElement.textContent.replace('€', '')
  );

  // another way of node >> array conversion
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];

  console.log(
    movementsUI2.map(domElement => +domElement.textContent.replace('€', ''))
  );
});

//

// ------------------------------------------- from lectures
// ---- remainder %

// select all rows of the movements (<div class="movements__row">)
// paint them based on conditions

// document.querySelectorAll('.movements__row'); // returns node list

// do this in event listener when you've entered the user account; without it, it will execute at the start of the app and be overwritten

//

labelBalance.addEventListener('click', function () {
  // use spread operator to convert it to array
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // color every second row of movements
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    // paint every 3rd row
    if (i % 3 === 0) row.style.backgroundColor = 'lightgray';
  });
});

// ---- date

// parse a string from movementsDates

console.log(new Date(account1.movementsDates[0]));
// Mon Nov 18 2019 22:31:17 GMT+0100 (Central European Standard Time)
