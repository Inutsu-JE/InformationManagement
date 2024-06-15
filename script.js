document.addEventListener('DOMContentLoaded', (event) => {
    loadData();
});

function loadData() {
    // Fetch data from the backend and populate the table
    // For demonstration, we'll use static data
    let data = [
        {employee: 'John Doe', department: 'HR', project: 'Hiring', task: 'Interview'},
        {employee: 'Jane Smith', department: 'IT', project: 'Website', task: 'Development'}
    ];

    let dataTable = document.getElementById('dataTable');
    data.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.employee;
        row.insertCell(1).innerText = item.department;
        row.insertCell(2).innerText = item.project;
        row.insertCell(3).innerText = item.task;
        let actionsCell = row.insertCell(4);
        actionsCell.innerHTML = `<button onclick="editRow(${index})">Edit</button><button onclick="deleteRow(${index})">Delete</button>`;
    });
}

function searchData() {
    // Implement search functionality
    let searchInput = document.getElementById('searchInput').value;
    alert('Search for: ' + searchInput);
}

function insertData() {
    // Implement insert functionality
    alert('Insert new data');
}

function editRow(index) {
    // Implement edit functionality
    alert('Edit row: ' + index);
}

function deleteRow(index) {
    // Implement delete functionality
    alert('Delete row: ' + index);
}
