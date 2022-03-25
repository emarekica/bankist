# BANKIST

<br>

Minimalist online banking app, made as a part of the [Jonas Smedtmann's JavaScript course](https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/22648713#notes).

<br><br>

---

<br>

**mockup**

<br>

![bankist mockup](./img/bankist-mockup.png)

<br><br>

---

<br>

## Technologies

<br>

- HTML, CSS
- JavaScript

<br><br>

---

<br>

**flowchart**

<br>

![bankist flowchart](./img/bankist-flowchart.png)

<br><br>

---

<br>

## Content

<br>

1. [Intro](#1-intro)
2. [Creating DOM elements](#2-creating-dom-elements)

---

<br>

## 1. Intro

<br>

**Part I:**
<br>

- display of movements

- enabling Transfer money, Request loan, Close account operations

- calculating statistics

- current balance

<br>

We will use **objects instead of maps** because we will simulate that the **data comes from Web API**.

Data from Web API comes as objects.

<br><br>

opacity: 0 >> element is invisible

opacity: 100 >> element is visible
<br>

Log in/out changes the opacity (JS).

<br><br>

---

<br>

## 2. Creating DOM elements

<br>

### Displaying movements

<br>

- each movements has one element

- with `forEach()` we loop through `movements` array, each iteration displays one element for each movement
  <br><br>

- good practice is to create a function and pass the data in instead of have the function work with a global variable
  <br><br>

- create **HTML template with template literal**

- add `movements` data
  <br><br>

- attach created HTML template to the `movements` container with `insertAdjacentHTML()` method

- new movements are added on top with `afterbegin` >> inverted with `beforeend`
  <br><br>

### Adding new elements

<br>

- first, empty the container: `containerMovements.innerHTML = "";`

<br><br>

```js
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

// display of movements
const displayMovements = function (movements) {
  // empty the container to add new elements
  containerMovements.innerHTML = '';

  movements.array.forEach(function(mov, i) => {

    // check if deposit or withdrawal
    const depositType = mov > 0 ? 'deposit' : 'withdrawal';

    // creating one row of movements
    const html = `
      <div class="movements__row">
        <div
          class="movements__type movements__type--${depositType}">
          ${i + 1} ${depositType}
        </div>
        <div class="movements__value">${mov}</div>
      </div>`;

    // attach HTML template to movements element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
```

<br><br>

`insertAdjacentHTML(1, 2)`
<br><br>

Accepts 2 strings:

- 1: **position** at which we want to attach the HTML

- 2: **text**, string containing HTML we want to insert
  <br><br>

      containerMovements.insertAdjacentHTML('afterbegin', html);

  <br>

[MDN insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

<br><br>

`textContent` VS `innerHTML`

<br>

- `textContent` returns only the text

- `innerHTML` returns everything, including the HTML (included all HTML tags)

<br><br>

    console.log(containerMovements.innerHTML); // displays complete HTML

---

<br>

## 3.

<br>

<br><br>

---

<br>

##
