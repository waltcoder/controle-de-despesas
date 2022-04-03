// Pegando a referencia do transactions Ul
const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
}

const addTransactionIntoDOM = ({ amount, name, id}) => {
  // criando operador para ver se é o amount é positivo ou negativo
  const operator = amount < 0 ? '-' : '+';
  // adicionando CSSclas no li
  const CSSClass = amount < 0 ? 'minus' : 'plus' ;
  const amountWithOperator = Math.abs(amount);
  // criando a tag li
  const li = document.createElement('li');
  // adicionando tags no li
  li.classList.add(CSSClass);
  // Inserindo a li dentro da tag Ul
  li.innerHTML = `
  ${name}
  <span>${operator} R$ ${amountWithOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`;
  transactionUl.append(li)
}


const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0 ).toFixed(2);

const updateBalancesValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalancesValues();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000 );

const addToTransactionArray = (transactionName, transactionAmount) => {
  const transaction = {
      id: generateID(),
     name: transactionName,
     amount: Number(transactionAmount),
    };
  transactions.push(transaction);
}

const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
  event.preventDefault();
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeEmpty = transactionName === '' || transactionAmount === '';
  if(isSomeEmpty){
    alert('Por favor, preencha tanto o nome quanto o valor da transação');
    return;
  }
  addToTransactionArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();
  cleanInputs();
}

form.addEventListener('submit', handleFormSubmit)
