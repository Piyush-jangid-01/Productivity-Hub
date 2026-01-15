let trnasactions = [
    {
        Id : 1,
        Date : "2024-06-01",
        Description : "Grocery Shopping",
        Amount : -50.75,
        status : "Success"
        type : "Expense"
    },
    {
        Id : 1,
        Date : "2024-06-01",
        Description : "Grocery Shopping",
        Amount : -50.75,
        status : "Success"
        type : "Expense"
    },
    {
        Id : 1,
        Date : "2024-06-01",
        Description : "Grocery Shopping",
        Amount : -50.75,
        status : "Success"
        type : "Expense"
    }
];

let monthlyIncome = 0;
let monthlyExpense = 0;

const today = new Date().toISOString().split('T')[0];
document.getElementById('income-date').value = today;
document.getElementById('expense-date').value = today;

function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if(modalId === 'incomeModal') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value = today;
    } else if(modalId === 'expenseModal') {
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value = today;
    }
}

window.onclick = function(event) {
    const incomeModal = document.getElementById('incomeModal');
    const expenseModal = document.getElementById('expenseModal');

    if (event.target === incomeModal) {
        closeModal('incomeModal');
    } else if (event.target === expenseModal) {
        closeModal('expenseModal');
    }
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;
    const description = document.getElementById('incomeDescription').value;
    const category = document.getElementById('incomeCategory').value;
}