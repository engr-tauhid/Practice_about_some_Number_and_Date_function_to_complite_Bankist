'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

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
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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
    '2024-07-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const clcDifferanceDay = date =>
    Math.trunc(
      Math.abs(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    function displayDates() {
      const date = new Date(acc.movementsDates[i]);
      let gave = clcDifferanceDay(date);
      if (gave === 0) return `Today`;
      if (gave === 1) return `Yestarday`;
      if (gave <= 7) return `${gave} days ago`;
      else {
        let obj = {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        };
        return Intl.DateTimeFormat(`${currentAccount.locale}`, obj).format(
          date
        );
      }
    }
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDates()}</div>
        <div class="movements__value">${formatedCurrency(
          mov,
          acc.locale,
          acc.currency
        )}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
function formatedCurrency(
  value,
  locale = navigator.language,
  currency = 'USD'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatedCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatedCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatedCurrency(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatedCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

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
function DateTimeFormat(date) {
  if(currentAccount)return Intl.DateTimeFormat(`${currentAccount.locale}`, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
  //date time format
  if (currentAccount) setInterval(() => {
      labelDate.textContent = DateTimeFormat(new Date()); 
  }, 1000)
};
// console.log(Number.parseFloat('234.234552jadlhf'));
///////////////////////////////////////
// Event handlers
let currentAccount , timer;
/////timer set
function set_Timeout (){
  let trick = function(){
    let minute =String( Math.trunc(time / 60)).padStart(2 ,0);
    let seconds = String(time % 60).padStart(2 , 0);
  labelTimer.textContent = `${minute}:${seconds}`
  if(time === 0){
  clearInterval(timer);
  labelWelcome.textContent ='Login to get started';
  containerApp.style.opacity = 0;
  currentAccount = ''
}
  time--;
}
  let time = 60*5;
  trick()
  let timer = setInterval(trick , 1000);
  return timer;
}

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    ///timer
    if(timer)clearInterval(timer)
    timer = set_Timeout()
    // Update UI
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const date = new Date().toISOString();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(date);
    receiverAcc.movementsDates.push(date);
    ///timer
    clearInterval(timer);
    timer = set_Timeout();
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    ///timer
    clearInterval(timer);
    timer = set_Timeout();
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
///
//fake login ()
function FakeLogin() {
  currentAccount = account2;
  updateUI(currentAccount);
  containerApp.style.opacity = 1;
}
// FakeLogin();
////
const number = 324223423.23423;
const opction = {
  currency: 'USD',
};
// setInterval (function clock(){
//   let now = new Date()
//   let clocking = new Intl.DateTimeFormat('en-US',{hour:'2-digit',minute:"2-digit",second:'2-digit'}).format(now)
//   console.log(clocking)
// })

// console.log(new Intl.DateTimeFormat('bn').format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat().format(new Date()));
// console.log(new Intl.DateTimeFormat(navigator.language).format(new Date()));
// console.log(new Intl.DateTimeFormat(navigator.language).format(new Date()));
// console.log(new Intl.DateTimeFormat(navigator.language).format(new Date()));
////////////////////////////////////////
///////////////////////////////////
//////lectures
// console.log(20 === 20.0)
// console.log(0.1 + 0.2)
// console.log(0.1 + 0.2 === 0.3)
// console.log(0.1 + 0.3 === 0.4)
// ///parsing
// console.log(Number.parseInt('3opx'))
// console.log(Number.parseInt("3032osahdfkljsdhfioh32342"))
// console.log(Number.parseInt("3032osahdfkljsdh"))
// console.log(Number.parseInt("332osahdfkljsdhfioh32342"))
// console.log(Number.parseInt("  3032osahdfkljs342   "))
// ///for convarting string to number we need to make sure that the string is start with Number
// /////But we can't convert string to tumber when a carecter is fron of the string like this
// console.log(Number.parseInt('e23434342'))
// console.log(Number.parseInt('23.443%'))
// /////but white space is not have any effact on those operation like you can see on line 210 and line 218
// ///perse float
// console.log(Number.parseFloat('34.53px'))
// console.log(Number.parseFloat('   34.53px    '))
// console.log(Number.parseFloat('34.53%'))
// //now we also can use those function as global function but thats is some old school way to do so we avoit to do that but for the damonstration let's give it a try
// console.log(parseInt('34Px'))
// /// just try to avoid that
// // let's now chack is serten value is number or not and also chack some functon regurding those technology
// console.log(Number.isNaN('34'))// this is not NAN so we get False
// console.log(Number.isNaN(34))
// console.log(Number.isNaN(34 / 0)) // some thing devided by 0 is infinity so it's not NAN
// console.log(Number.isNaN(+"34px"))
// console.log(Number.isNaN("34.5"))
// console.log(Number.isNaN("e34Px"))
// ///// but we just need to ignore this funciton because there is not so much use case for this function
// ///but there is one that is isFinite functon that is really use for chacking that is sertine value is really is numbe and not so there is some very fine use case for this function now write this at onece
// console.log('---------chack Isfinite Function ----------')
// console.log(Number.isFinite(34))
// console.log(Number.isFinite('34'))
// console.log(Number.isFinite(+'34'))
// console.log(Number.isFinite('4345px'))
// console.log(Number.isFinite(3.5))
// console.log(Number.isFinite('ed349'))
// console.log(Number.isFinite(32/3))
// console.log(Number.isFinite(34/0))
// console.log('chck is integer')
// console.log(Number.isInteger('34'))
// console.log(Number.isInteger(+'34'))
// console.log(Number.isInteger(+'34px'))
// console.log(Number.isInteger(23))
// console.log(Number.isInteger(23.03))
// console.log(Number.isInteger(23.0))
// console.log(5 ** 5)
// console.log(3125 / 5)
// console.log(5 ** 441)
// console.log(Math.sqrt(40))
// console.log(Math.sqrt(400))
// console.log(Math.sqrt(25))
// console.log(Math.sqrt(25.45))
// console.log('---we can only squre root of some number using this function but in some time we need qubic root and more higer then that so then we need to use ** with (1 / the number)  so by this way we can get the perfect combination of our operation');
// console.log(25 ** (1/2))
// console.log(25 ** (1/3))
// console.log(25 ** (1/4))
// console.log(25 ** (1/5))
// console.log('now let chack how to get the maximum and min value from some numbers');
// console.log(Math.max(1,32,5,3,56,3,53,2,4,534,343,534,3,43,34,34,2323245,23232,2,999999999999,3432))
// console.log(Math.min(1,32,5,3,56,3,53,2,4,534,343,534,3,43,34,34,2323245,23232,2,999999999999,3432))
// console.log(Math.max(1,32,5,3,"56",3,53,2,4,534,343,534,3,43,34,34,"2323245",23232,2,"999999999999",3432))
// console.log(Math.min("1",32,5,3,56,3,53,2,4,534,343,534,3,43,34,34,2323245,23232,2,999999999999,3432))
// console.log(Math.max(1,32,5,3,56,3,53,2,4,534,343,534,3,43,34,34,2323245,23232,2,"999999999999edfdsa",3432) , 'dont parse Number ')
// console.log(Math.min("1derf",32,5,3,56,3,53,2,4,534,343,534,3,43,34,34,2323245,23232,2,999999999999,3432) , 'dont parse Number ')
// console.log('also we can spred the array on this funciton to get te actual value')
// console.log(Math.max(...movements))
// console.log(Math.min(...movements))
// /////now use rounding
// console.log(Math.PI * Number.parseFloat ('10px') ** 2)
// const GenerateRandomNumbers = (min , max)=> Math.floor(Math.random() * (max - min))+ 1 + min;
///min = 10 max = 20 so (math.random ()* (min - max = 10) = min 0 max 9 )+ 1 = min 1 max 10 + min = min = 11 max = 20
// console.log(GenerateRandomNumbers(10 ,20))
// console.log(Math.round(32.5))
// console.log(Math.round(32.4))
// console.log('=====')
// console.log(Math.ceil(32.7))
// console.log(Math.ceil(32.1))
// console.log('=====')
// console.log(Math.floor(32.556443))
// console.log(Math.floor(32.556443))
// console.log('=====')
// console.log(Math.trunc(32.556443))
// console.log(Math.floor(32.556443))
// console.log('=====')
// console.log(Math.floor(-32.4))
// console.log(Math.trunc(-32.4))
// console.log(+(4.234324).toFixed(3))
// console.log(+(4.32).toFixed(3))
// console.log(+(4.556765).toFixed(1))
// console.log(+(4).toFixed(3))
// console.log(3 % 2)
// console.log(2.34 % 2)
// let arr = [];
// for (let x = 0 ; x < 10 ; x++) arr.push(x + 1)
//   console.log(arr)
// function chckCompliteDivition (el){
//   if(el % 2 === 0) console.log(true);
//   else console.log(false)
// }

// chckCompliteDivition(4)
// chckCompliteDivition(3)
// chckCompliteDivition(100)
// let finalvalue = arr.filter(el => el % 2 === 0)
// console.log(finalvalue)
// labelBalance.addEventListener('click' , (e)=> {
//   let allMovementsRow = [...document.querySelectorAll('.movements__row')]
//   allMovementsRow.forEach((el , i) =>{
//     if(i % 2 === 0)el.style.backgroundColor = '#777'
//     else {el.style.backgroundColor = 'blue'}

//   })
// // })
// console.log(9_007_199_254_740_991)
// ////////big int
// console.log(9999999999999999999999999999999996n *999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999n + ' is too big')
// console.log('we can do all of the opertion by big int but we cant use === and also cant use any number with it but if you make operation with regular number then you need to convert then by BigInt function like this = Bigint(regNum) ')

///create a date
// const now = new Date()
// console.log(now)
// console.log(new Date('July 23 2024 02:05:33').getFullYear())
// console.log(new Date (account1.movementsDates[0]))
// console.log(new Date('2024-07-24').getTime())
// console.log(new Date(1721779200000 - (24*60*60*1000)))
// console.log(new Date(1721779200000))
// let date = 1721779200000
// let arr =[];
// account1.movements.forEach((el , i )=> {
//   arr.push(new Date(date));
//   date = date - (24*60*60*1000)
// })
// console.log(arr)
// arr.forEach(el=> console.log(new Date(el).toISOString()))
// let ubran = setTimeout(() => {
//   console.log('llaal')
// }, 3000);
// account1.movementsDates.forEach(el => console.log(new Date(el).getTime()));
