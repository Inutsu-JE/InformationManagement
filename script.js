document.addEventListener('DOMContentLoaded', (event) => {
    loadData();
});

let data = [
    {employee: 'John Doe', department: 'HR', project: 'Hiring', task: 'Interview'},
    {employee: 'Jane Smith', department: 'IT', project: 'Website', task: 'Development'},
    {employee: 'Jane Smith', department: 'IT', project: 'Website', task: 'Development'}
];

function loadData() {
    let dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = "";  // Clear all rows

    // Load the data into the table
    data.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.employee;
        row.insertCell(1).innerText = item.department;
        row.insertCell(2).innerText = item.project;
        row.insertCell(3).innerText = item.task;
        // Add click event listener to each row
        row.addEventListener('click', () => displayRowData(index));
    });
}

function displayRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = data[index];
    document.getElementById('rightPanel').innerHTML = `
        <h2>${rowData.employee}</h2>
        <p><strong>Department:</strong> ${rowData.department}</p>
        <p><strong>Project:</strong> ${rowData.project}</p>
        <p><strong>Task:</strong> ${rowData.task}</p>
        <div class="actions">
            <button onclick="editRow(${index})">Edit</button>
            <button onclick="deleteRow(${index})">Delete</button>
        </div>
    `;
    toggleRightPanel();
}

function searchData() {
    // Implement search functionality
    let searchInput = document.getElementById('searchInput').value;
    alert('Search for: ' + searchInput);
}

function insertData() {
    // Implement insert functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
        <div class="form-container" id="addForm">
            <input type="text" id="employeeInput" placeholder="Employee">
            <input type="text" id="departmentInput" placeholder="Department">
            <input type="text" id="projectInput" placeholder="Project">
            <input type="text" id="taskInput" placeholder="Task">
            <button id="saveButton" onclick="saveData()">Save</button>
        </div>
    `;
    toggleRightPanel();
}

function editRow(index) {
    // Implement edit functionality
    alert('Edit row: ' + index);
}

function deleteRow(index) {
    // Implement delete functionality
    alert('Delete row: ' + index);
}

function toggleRightPanel() {
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.toggle('hidden');
}

function saveData() {
    let employee = document.getElementById('employeeInput').value;
    let department = document.getElementById('departmentInput').value;
    let project = document.getElementById('projectInput').value;
    let task = document.getElementById('taskInput').value;

    if (employee && department && project && task) {
        addData(employee, department, project, task);
        loadData();
        toggleRightPanel(); // Hide the right panel after saving data
        // Clear the form fields
        document.getElementById('employeeInput').value = '';
        document.getElementById('departmentInput').value = '';
        document.getElementById('projectInput').value = '';
        document.getElementById('taskInput').value = '';
    } else {
        alert("Please fill in all fields.");
    }
}

function addData(employee, department, project, task) {
    // Check if the entry already exists to avoid duplicates
    for (let entry of data) {
        if (entry.employee === employee && entry.department === department && 
            entry.project === project && entry.task === task) {
            console.log("This entry already exists.");
            return;
        }
    }
    
    // Add new entry if it doesn't exist
    data.push({employee, department, project, task});
    console.log("New entry added.");
}
