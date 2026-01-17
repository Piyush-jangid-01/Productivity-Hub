const STORAGE_KEY = "expenseTrackerData";

let transactions = [];

let monthlyIncome = 0;
let monthlyExpense = 0;

/* ================= DATE SETUP ================= */

const today = new Date().toISOString().split("T")[0];
document.getElementById("incomeDate").value = today;
document.getElementById("expenseDate").value = today;

/* ================= MODALS ================= */

function openIncomeModal() {
  document.getElementById("incomeModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function openExpenseModal() {
  document.getElementById("expenseModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.style.overflow = "auto";

  if (modalId === "incomeModal") {
    document.getElementById("incomeForm").reset();
    document.getElementById("incomeDate").value = today;
  } else {
    document.getElementById("expenseForm").reset();
    document.getElementById("expenseDate").value = today;
  }
}

window.onclick = function (event) {
  if (event.target.id === "incomeModal") closeModal("incomeModal");
  if (event.target.id === "expenseModal") closeModal("expenseModal");
};

/* ================= ADD INCOME ================= */

function addIncome() {
  const amount = parseFloat(document.getElementById("incomeAmount").value);
  const date = document.getElementById("incomeDate").value;
  const description = document.getElementById("incomeDescription").value;
  const category = document.getElementById("incomeCategory").value;

  if (!amount || amount <= 0 || !date || !category) {
    alert("Please fill all required fields correctly");
    return;
  }

  const transaction = {
    id: Date.now(),
    date,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    description: description || "No description",
    amount,
    status: "Success",
    type: "Income"
  };

  transactions.unshift(transaction);
  monthlyIncome += amount;

  updateDashboard();
  addTransactionToTable(transaction);

  closeModal("incomeModal");
  saveToLocalStorage();
}

/* ================= ADD EXPENSE ================= */

function addExpense() {
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const date = document.getElementById("expenseDate").value;
  const description = document.getElementById("expenseDescription").value;
  const category = document.getElementById("expenseCategory").value;

  if (!amount || amount <= 0 || !date || !category) {
    alert("Please fill all required fields correctly");
    return;
  }

  const transaction = {
    id: Date.now(),
    date,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    description: description || "No description",
    amount: -amount,
    status: "Success",
    type: "Expense"
  };

  transactions.unshift(transaction);
  monthlyExpense += amount;

  updateDashboard();
  addTransactionToTable(transaction);

  closeModal("expenseModal");
  saveToLocalStorage();
}

/* ================= DASHBOARD ================= */

function updateDashboard() {
  document.querySelector(".income-amount").textContent =
    `$${monthlyIncome.toFixed(2)}`;

  document.querySelector(".expense-amount").textContent =
    `$${monthlyExpense.toFixed(2)}`;

  const incomeEl = document.getElementById("amount-income-amount");
  const expenseEl = document.getElementById("amount-expense-amount");

  if (incomeEl) incomeEl.textContent = `$${monthlyIncome.toFixed(2)}`;
  if (expenseEl) expenseEl.textContent = `$${monthlyExpense.toFixed(2)}`;
}


/* ================= TABLE ================= */

function addTransactionToTable(txn) {
  const tbody = document.querySelector(".transactions-table tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${txn.date}</td>
    <td>${txn.description}</td>
    <td>$${Math.abs(txn.amount).toFixed(2)}</td>
    <td><span class="status-success">${txn.status}</span></td>
    <td>
      <button class="action-btn">
        <i class="fas fa-ellipsis-h"></i>
      </button>
    </td>
  `;

  tbody.prepend(row);
}

/* ================= EXPORT TO CSV ================= */

function updateHeaderDate() {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const todayFormatted = new Date().toLocaleDateString("en-GB", options);
  document.getElementById("currentDate").textContent = todayFormatted;
}

function exportToCSV() {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  const headers = ["Date", "Category", "Description", "Amount", "Type", "Status"];

  const rows = transactions.map(txn => [
    txn.date,
    txn.category,
    txn.description,
    txn.amount,
    txn.type,
    txn.status
  ]);

  let csvContent =
    headers.join(",") +
    "\n" +
    rows.map(row => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Expense_Tracker_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


/* ================= LOCAL STORAGE ================= */

function saveToLocalStorage() {
  const data = {
    transactions,
    monthlyIncome,
    monthlyExpense
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) return;

  const data = JSON.parse(savedData);

  transactions = data.transactions || [];
  monthlyIncome = data.monthlyIncome || 0;
  monthlyExpense = data.monthlyExpense || 0;

  updateDashboard();
  renderAllTransactions();
}

function renderAllTransactions() {
  const tbody = document.querySelector(".transactions-table tbody");
  tbody.innerHTML = "";

  transactions.forEach(txn => {
    addTransactionToTable(txn);
  });
}

/* ================= LOAD DATA ON STARTUP ================= */
loadFromLocalStorage();
updateDashboard();
updateHeaderDate();


