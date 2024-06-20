document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    loadData();
    addNavBarEventListeners(); // Call the function to add event listeners to the nav bar buttons
    // var rightPanel = document.getElementById('rightPanel');
    // rightPanel.classList.toggle('hidden');

    

});

function toggleRightPanel() {
    var rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.toggle('hidden');
}

let data = [
    {employee: 'John Doe', department: 'HR', project: 'Hiring', task: 'Interview'},
    {employee: 'Jane Smith', department: 'IT', project: 'Website', task: 'Development'},
    {employee: 'Jane Smith', department: 'IT', project: 'Website', task: 'Development'}
];

let employeeData = [
    {employee_id: 1, name: 'John Doe', department_id: 'HR01', position: 'Manager', hire_date: '2020-01-15'},
    {employee_id: 2, name: 'Jane Smith', department_id: 'IT02', position: 'Developer', hire_date: '2019-03-12'},
    {employee_id: 3, name: 'Bob Johnson', department_id: 'IT02', position: 'Analyst', hire_date: '2018-07-22'}
];

let departmentData = [
    {department_id: 'HR01', name: 'Human Resources', manager: 1, location: 'Building 1'},
    {department_id: 'IT02', name: 'Information Technology', manager: 2, location: 'Building 2'},
    {department_id: 'FIN03', name: 'Finance', manager: 3, location: 'Building 3'}
];

let projectData = [
    { project_id: 1, name: 'Project A', department_id: 'IT02', start_date: '2023-01-01', end_date: '2023-06-30' },
    { project_id: 2, name: 'Project B', department_id: 'HR01', start_date: '2023-02-15', end_date: '2023-08-31' },
    // Add more project data as needed
];

let taskData = [
    { task_id: 1, project_id: 1, description: 'Task 1', start_date: '2023-01-01', end_date: '2023-01-31', status: 'In Progress' },
    { task_id: 2, project_id: 2, description: 'Task 2', start_date: '2023-02-15', end_date: '2023-03-15', status: 'Completed' },
    // Add more task data as needed
];

function loadTaskData() {
    let dataTable = document.getElementById('taskDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    // Load the data into the table
    taskData.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.task_id;
        row.insertCell(1).innerText = item.project_id;
        row.insertCell(2).innerText = item.description;
        row.insertCell(3).innerText = item.start_date;
        row.insertCell(4).innerText = item.end_date;
        row.insertCell(5).innerText = item.status;
        // Add click event listener to each row
        row.addEventListener('click', () => displayTaskRowData(index));
    });
}

function displayTaskRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = taskData[index];
    document.getElementById('rightPanel').innerHTML = `
     <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <h2>${rowData.employee}</h2>
        <h2>${rowData.description}</h2>
        <p><strong>Task ID:</strong> ${rowData.task_id}</p>
        <p><strong>Project ID:</strong> ${rowData.project_id}</p>
        <p><strong>Description:</strong> ${rowData.description}</p>
        <p><strong>Start Date:</strong> ${rowData.start_date}</p>
        <p><strong>End Date:</strong> ${rowData.end_date}</p>
        <p><strong>Status:</strong> ${rowData.status}</p>
        <div class="actions">
            <button onclick="editTaskRow(${index})">Edit</button>
            <button onclick="deleteTaskRow(${index})">Delete</button>
        </div>
    `;
     // Check if #rightPanel is hidden before toggling
     let rightPanel = document.getElementById('rightPanel');
     if (rightPanel.classList.contains('hidden')) {
         toggleRightPanel();
     }
}

function searchTaskData() {
    // Implement search task functionality
    let searchInput = document.getElementById('taskSearchInput').value;
    alert('Search for task: ' + searchInput);
}

function insertTaskData() {
    // Implement insert task functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
    <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <div class="form-container" id="addForm">
            
            <input type="text" id="taskIdInput" placeholder="Task ID">
            <input type="text" id="projectIdInput" placeholder="Project ID">
            <input type="text" id="taskDescriptionInput" placeholder="Description">
            <input type="text" id="taskStartDateInput" placeholder="Start Date">
            <input type="text" id="taskEndDateInput" placeholder="End Date">
            <input type="text" id="taskStatusInput" placeholder="Status">
            <button id="saveTaskButton" onclick="saveTaskData()">Save</button>
        </div>
    `;
     // Check if #rightPanel is hidden before toggling
     let rightPanel = document.getElementById('rightPanel');
     if (rightPanel.classList.contains('hidden')) {
         toggleRightPanel();
     }
}

function saveTaskData() {
    let task_id = document.getElementById('taskIdInput').value;
    let project_id = document.getElementById('projectIdInput').value;
    let description = document.getElementById('taskDescriptionInput').value;
    let start_date = document.getElementById('taskStartDateInput').value;
    let end_date = document.getElementById('taskEndDateInput').value;
    let status = document.getElementById('taskStatusInput').value;

    if (task_id && project_id && description && start_date && end_date && status) {
        addTaskData(task_id, project_id, description, start_date, end_date, status);
        loadTaskData();
        toggleRightPanel(); // Hide the right panel after saving data
        // Clear the form fields
        document.getElementById('taskIdInput').value = '';
        document.getElementById('projectIdInput').value = '';
        document.getElementById('taskDescriptionInput').value = '';
        document.getElementById('taskStartDateInput').value = '';
        document.getElementById('taskEndDateInput').value = '';
        document.getElementById('taskStatusInput').value = '';
    } else {
        alert("Please fill in all fields.");
    }
}

function addTaskData(task_id, project_id, description, start_date, end_date, status) {
    // Check if the entry already exists to avoid duplicates
    for (let entry of taskData) {
        if (entry.task_id == task_id) {
            console.log("This entry already exists.");
            return;
        }
    }

    // Add new entry if it doesn't exist
    taskData.push({ task_id, project_id, description, start_date, end_date, status });
    console.log("New task added.");
}

function editTaskRow(index) {
    // Implement edit task functionality
    alert('Edit task row: ' + index);
}

function deleteTaskRow(index) {
    // Implement delete task functionality
    alert('Delete task row: ' + index);
}


function loadProjectData() {
    let dataTable = document.getElementById('projectDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    // Load the data into the table
    projectData.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.project_id;
        row.insertCell(1).innerText = item.name;
        row.insertCell(2).innerText = item.department_id;
        row.insertCell(3).innerText = item.start_date;
        row.insertCell(4).innerText = item.end_date;
        // Add click event listener to each row
        row.addEventListener('click', () => displayProjectRowData(index));
    });
}

function displayProjectRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = projectData[index];
    document.getElementById('rightPanel').innerHTML = `
     <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <h2>${rowData.employee}</h2>
        <h2>${rowData.name}</h2>
        <p><strong>Project ID:</strong> ${rowData.project_id}</p>
        <p><strong>Department ID:</strong> ${rowData.department_id}</p>
        <p><strong>Start Date:</strong> ${rowData.start_date}</p>
        <p><strong>End Date:</strong> ${rowData.end_date}</p>
        <div class="actions">
            <button onclick="editProjectRow(${index})">Edit</button>
            <button onclick="deleteProjectRow(${index})">Delete</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function searchProjectData() {
    // Implement search project functionality
    let searchInput = document.getElementById('projectSearchInput').value;
    alert('Search for: ' + searchInput);
}

function insertProjectData() {
    // Implement insert project functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
    <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <div class="form-container" id="addForm">
           
            <input type="text" id="projectIdInput" placeholder="Project ID">
            <input type="text" id="projectNameInput" placeholder="Name">
            <input type="text" id="projectDepartmentIdInput" placeholder="Department ID">
            <input type="text" id="projectStartDateInput" placeholder="Start Date">
            <input type="text" id="projectEndDateInput" placeholder="End Date">
            <button id="saveProjectButton" onclick="saveProjectData()">Save</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function saveProjectData() {
    let project_id = document.getElementById('projectIdInput').value;
    let name = document.getElementById('projectNameInput').value;
    let department_id = document.getElementById('projectDepartmentIdInput').value;
    let start_date = document.getElementById('projectStartDateInput').value;
    let end_date = document.getElementById('projectEndDateInput').value;

    if (project_id && name && department_id && start_date && end_date) {
        addProjectData(project_id, name, department_id, start_date, end_date);
        loadProjectData();
        toggleRightPanel(); // Hide the right panel after saving data
        // Clear the form fields
        document.getElementById('projectIdInput').value = '';
        document.getElementById('projectNameInput').value = '';
        document.getElementById('projectDepartmentIdInput').value = '';
        document.getElementById('projectStartDateInput').value = '';
        document.getElementById('projectEndDateInput').value = '';
    } else {
        alert("Please fill in all fields.");
    }
}

function addProjectData(project_id, name, department_id, start_date, end_date) {
    // Check if the entry already exists to avoid duplicates
    for (let entry of projectData) {
        if (entry.project_id == project_id) {
            console.log("This entry already exists.");
            return;
        }
    }

    // Add new entry if it doesn't exist
    projectData.push({ project_id, name, department_id, start_date, end_date });
    console.log("New entry added.");
}


function loadData() {
    
}



function loadEmployeeData() {
    let dataTable = document.getElementById('employeeDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    // Load the data into the table
    employeeData.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.employee_id;
        row.insertCell(1).innerText = item.name;
        row.insertCell(2).innerText = item.department_id;
        row.insertCell(3).innerText = item.position;
        row.insertCell(4).innerText = item.hire_date;
        // Add click event listener to each row
        row.addEventListener('click', () => displayEmployeeRowData(index));
    });
}

function loadDepartmentData() {
    let dataTable = document.getElementById('departmentDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    // Load the data into the table
    departmentData.forEach((item, index) => {
        let row = dataTable.insertRow();
        row.insertCell(0).innerText = item.department_id;
        row.insertCell(1).innerText = item.name;
        row.insertCell(2).innerText = item.manager;
        row.insertCell(3).innerText = item.location;
        // Add click event listener to each row
        row.addEventListener('click', () => displayDepartmentRowData(index));
    });
}

function displayRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = data[index];
    document.getElementById('rightPanel').innerHTML = `
    <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <h2>${rowData.employee}</h2>
        <p><strong>Department:</strong> ${rowData.department}</p>
        <p><strong>Project:</strong> ${rowData.project}</p>
        <p><strong>Task:</strong> ${rowData.task}</p>
        <div class="actions">
            <button onclick="editRow(${index})">Edit</button>
            <button onclick="deleteRow(${index})">Delete</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function displayEmployeeRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = employeeData[index];
    document.getElementById('rightPanel').innerHTML = `
     <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <h2>${rowData.employee}</h2>
        <h2>${rowData.name}</h2>
        <p><strong>Employee ID:</strong> ${rowData.employee_id}</p>
        <p><strong>Department ID:</strong> ${rowData.department_id}</p>
        <p><strong>Position:</strong> ${rowData.position}</p>
        <p><strong>Hire Date:</strong> ${rowData.hire_date}</p>
        <div class="actions">
            <button onclick="editEmployeeRow(${index})">Edit</button>
            <button onclick="deleteEmployeeRow(${index})">Delete</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function displayDepartmentRowData(index) {
    // Display the data of the clicked row in the right panel
    let rowData = departmentData[index];
    document.getElementById('rightPanel').innerHTML = `
     <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <h2>${rowData.employee}</h2>
        <h2>${rowData.name}</h2>
        <p><strong>Department ID:</strong> ${rowData.department_id}</p>
        <p><strong>Manager (Employee ID):</strong> ${rowData.manager}</p>
        <p><strong>Location (Building Number):</strong> ${rowData.location}</p>
        <div class="actions">
            <button onclick="editDepartmentRow(${index})">Edit</button>
            <button onclick="deleteDepartmentRow(${index})">Delete</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function searchData() {
    // Implement search functionality
    let searchInput = document.getElementById('searchInput').value;
    alert('Search for: ' + searchInput);
}

function searchEmployeeData() {
    // Implement search employee functionality
    let searchInput = document.getElementById('employeeSearchInput').value;
    alert('Search for: ' + searchInput);
}

function searchDepartmentData() {
    // Implement search department functionality
    let searchInput = document.getElementById('departmentSearchInput').value;
    alert('Search for: ' + searchInput);
}


function insertEmployeeData() {
    // Implement insert employee functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
    <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
        <div class="form-container" id="addForm">
            
            <input type="text" id="employeeIdInput" placeholder="Employee ID">
            <input type="text" id="employeeNameInput" placeholder="Name">
            <input type="text" id="employeeDepartmentIdInput" placeholder="Department ID">
            <input type="text" id="employeePositionInput" placeholder="Position">
            <input type="text" id="employeeHireDateInput" placeholder="Hire Date">
            <button id="saveEmployeeButton" onclick="saveEmployeeData()">Save</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function insertDepartmentData() {
    // Implement insert department functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
    <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></i></button>
        <div class="form-container" id="addForm">
            
            <input type="text" id="departmentIdInput" placeholder="Department ID">
            <input type="text" id="departmentNameInput" placeholder="Name">
            <input type="text" id="departmentManagerInput" placeholder="Manager (Employee ID)">
            <input type="text" id="departmentLocationInput" placeholder="Location (Building Number)">
            <button id="saveDepartmentButton" onclick="saveDepartmentData()">Save</button>
        </div>
    `;
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}

function editRow(index) {
    // Implement edit functionality
    alert('Edit row: ' + index);
}

function editEmployeeRow(index) {
    // Implement edit employee functionality
    alert('Edit employee row: ' + index);
}

function editDepartmentRow(index) {
    // Implement edit department functionality
    alert('Edit department row: ' + index);
}

function deleteRow(index) {
    // Implement delete functionality
    alert('Delete row: ' + index);
}

function deleteEmployeeRow(index) {
    // Implement delete employee functionality
    alert('Delete employee row: ' + index);
}

function deleteDepartmentRow(index) {
    // Implement delete department functionality
    alert('Delete department row: ' + index);
}

function saveEmployeeData() {
    let employee_id = document.getElementById('employeeIdInput').value;
    let name = document.getElementById('employeeNameInput').value;
    let department_id = document.getElementById('employeeDepartmentIdInput').value;
    let position = document.getElementById('employeePositionInput').value;
    let hire_date = document.getElementById('employeeHireDateInput').value;

    if (employee_id && name && department_id && position && hire_date) {
        addEmployeeData(employee_id, name, department_id, position, hire_date);
        loadEmployeeData();
        toggleRightPanel(); // Hide the right panel after saving data
        // Clear the form fields
        document.getElementById('employeeIdInput').value = '';
        document.getElementById('employeeNameInput').value = '';
        document.getElementById('employeeDepartmentIdInput').value = '';
        document.getElementById('employeePositionInput').value = '';
        document.getElementById('employeeHireDateInput').value = '';
    } else {
        alert("Please fill in all fields.");
    }
}

function saveDepartmentData() {
    let department_id = document.getElementById('departmentIdInput').value;
    let name = document.getElementById('departmentNameInput').value;
    let manager = document.getElementById('departmentManagerInput').value;
    let location = document.getElementById('departmentLocationInput').value;

    if (department_id && name && manager && location) {
        addDepartmentData(department_id, name, manager, location);
        loadDepartmentData();
        toggleRightPanel(); // Hide the right panel after saving data
        // Clear the form fields
        document.getElementById('departmentIdInput').value = '';
        document.getElementById('departmentNameInput').value = '';
        document.getElementById('departmentManagerInput').value = '';
        document.getElementById('departmentLocationInput').value = '';
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

function addEmployeeData(employee_id, name, department_id, position, hire_date) {
    // Check if the entry already exists to avoid duplicates
    for (let entry of employeeData) {
        if (entry.employee_id == employee_id) {
            console.log("This entry already exists.");
            return;
        }
    }
    
    // Add new entry if it doesn't exist
    employeeData.push({employee_id, name, department_id, position, hire_date});
    console.log("New entry added.");
}

function addDepartmentData(department_id, name, manager, location) {
    // Check if the entry already exists to avoid duplicates
    for (let entry of departmentData) {
        if (entry.department_id == department_id) {
            console.log("This entry already exists.");
            return;
        }
    }
    
    // Add new entry if it doesn't exist
    departmentData.push({department_id, name, manager, location});
    console.log("New entry added.");
}

function addNavBarEventListeners() {
    document.getElementById('dashboardButton').addEventListener('click', () => {
        displaySection('dashboardContent');
    });

    document.getElementById('employeeButton').addEventListener('click', () => {
        displaySection('employeeContent');
        loadEmployeeData(); // Load employee data when the Employee section is displayed
    });

    document.getElementById('departmentButton').addEventListener('click', () => {
        displaySection('departmentContent');
        loadDepartmentData(); // Load department data when the Department section is displayed
    });

    document.getElementById('projectButton').addEventListener('click', () => {
        displaySection('projectContent');
        loadProjectData(); // Load project data when the Project section is displayed
    });

    document.getElementById('taskButton').addEventListener('click', () => {
        displaySection('taskContent');
        loadTaskData(); // Load task data when the Task section is displayed
    });
}


function displaySection(sectionId) {
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    if (sectionId === 'dashboardContent') {
        // Display custom content for dashboard
        document.getElementById(sectionId).innerHTML = "<h2>nigga</h2>";
    } else {
        document.getElementById(sectionId).style.display = 'block';
    }
}
