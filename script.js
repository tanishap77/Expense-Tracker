const API_URL = "http://127.0.0.1:5500";

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

// When the page loads, get all expenses from backend and show them
window.onload = () => {
  fetchExpenses();
};

// When form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get input values
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  // Send expense data to backend to save
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, category, date }),
  });

  if (response.ok) {
    form.reset();     // Clear form fields
    fetchExpenses();  // Reload the expenses list from backend
  } else {
    alert("Failed to add expense.");
  }
});

// Function to get all expenses from backend and display
async function fetchExpenses() {
  const res = await fetch(`${API_URL}/expenses`);
  const expenses = await res.json();

  expenseList.innerHTML = ""; // Clear existing list

  let total = 0;

  expenses.forEach(({ id, amount, category, date }) => {
    total += parseFloat(amount);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">₹${amount}</td>
      <td class="p-2">${category}</td>
      <td class="p-2">${date}</td>
      <td class="p-2 text-red-600 cursor-pointer" onclick="deleteExpense(${id})">🗑️</td>
    `;
    expenseList.appendChild(row);
  });

  // Update total display
  document.getElementById("total-spent").textContent = total.toFixed(2);
}


// Function to delete expense by id
async function deleteExpense(id) {
  const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
  if (response.ok) {
    fetchExpenses(); // Refresh list after deleting
  } else {
    alert("Failed to delete expense.");
  }
}
