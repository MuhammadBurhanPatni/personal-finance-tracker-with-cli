// --- DOM Element Selection ---
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionListEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const themeSwitcherBtn = document.getElementById('theme-switcher');

// --- State Management ---

// Tries to get transactions from localStorage, or initializes an empty array.
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

/**
 * Updates the transactions array in localStorage.
 */
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

/**
 * Generates a unique ID.
 * A simple implementation for this project.
 * @returns {number} A unique number based on the current time.
 */
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

/**
 * Formats a number as a currency string.
 * @param {number} number - The number to format.
 * @returns {string} - The formatted currency string (e.g., $1,234.56).
 */
function formatCurrency(number) {
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * Adds a new transaction to the state and updates the UI.
 * @param {Event} e - The form submission event.
 */
function addTransaction(e) {
    e.preventDefault();

    // Basic validation
    if (titleInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a title and amount.');
        return;
    }

    // SENIOR ENGINEER FIX: Ensure expenses are stored as negative numbers
    const type = typeInput.value;
    let amount = parseFloat(amountInput.value);

    if (type === 'expense' && amount > 0) {
        amount = -amount;
    }
    
    if (type === 'income' && amount < 0) {
        amount = Math.abs(amount);
    }

    const transaction = {
        id: generateID(),
        title: titleInput.value,
        amount: amount,
        type: type,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    updateLocalStorage();
    init(); // Re-initialize the app to update the DOM

    // Clear form fields
    titleInput.value = '';
    amountInput.value = '';
}

/**
 * Deletes a transaction by its ID.
 * @param {number} id - The ID of the transaction to delete.
 */
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
    init(); // Re-initialize the app
}

/**
 * Creates and appends a transaction list item to the DOM.
 * @param {object} transaction - The transaction object to display.
 */
function addTransactionToDOM(transaction) {
    const item = document.createElement('li');
    
    // Add class based on transaction type
    const type = transaction.amount > 0 ? 'income' : 'expense';
    item.classList.add(type);

    const sign = transaction.amount > 0 ? '+' : '-';

    item.innerHTML = `
        <div class="details">
            <span class="title">${transaction.title}</span>
            <span class="date">${transaction.date}</span>
        </div>
        <span class="amount">${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
    `;

    transactionListEl.appendChild(item);
}


/**
 * Updates the summary cards (Balance, Income, Expense).
 */
function updateSummary() {
    const amounts = transactions.map(t => t.amount);

    const totalIncome = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);

    const totalExpense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0);

    const totalBalance = totalIncome + totalExpense; // totalExpense is already negative

    balanceEl.innerText = formatCurrency(totalBalance);
    incomeEl.innerText = formatCurrency(totalIncome);
    expenseEl.innerText = formatCurrency(Math.abs(totalExpense));
}

/**
 * Initializes the application.
 * Clears and re-renders all transactions and updates the summary.
 */
function init() {
    transactionListEl.innerHTML = ''; // Clear the list first
    transactions.forEach(addTransactionToDOM);
    updateSummary();
}

// --- Theme Switcher Logic ---
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcherBtn.innerText = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeSwitcherBtn.innerText = '🌙';
    }
}

function handleThemeSwitch() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

// --- Event Listeners ---
form.addEventListener('submit', addTransaction);
themeSwitcherBtn.addEventListener('click', handleThemeSwitch);


// --- Initial Load ---
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);
init();
