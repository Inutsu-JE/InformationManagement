document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    loadData();

    addNavBarEventListeners(); // Call the function to add event listeners to the nav bar buttons
  

    // Attach the searchData function to the click event of the search button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', searchData);
    } else {
        console.error('Search button element not found.');
    }
    

});

function searchData() {
    let searchInputValue = document.getElementById('searchInput').value.trim();

    if (searchInputValue !== '') {
        const encodedSearchTerm = encodeURIComponent(searchInputValue);

        fetch(`http://localhost:3000/search/${encodedSearchTerm}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Search results:', data);
                if (data.length === 0) {
                    alert('No results found.');
                } else {
                    // Assuming the first item has the ID
                    const firstItem = data[0];
                    const { type, id } = firstItem;
                    redirectToDetailsPage(type, id); // Redirect to details page based on type and id
                }
            })
            .catch(error => {
                console.error('Error searching:', error);
                alert('Failed to search. Please try again later.');
            });
    } else {
        alert('Please enter a search term.');
    }
}




function toggleRightPanel() {
    var rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.toggle('hidden');
}
// Function to format date to YYYY-MM-DD format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Pad month and day with leading zeros if needed
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}

//task DONE
async function loadTaskData() {
    let dataTable = document.getElementById('taskDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    try {
        const response = await fetch('http://localhost:3000/tasks');
        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }
        const taskData = await response.json();

        // Load the data into the table
        taskData.forEach((item, index) => {
            let row = dataTable.insertRow();
            row.insertCell(0).innerText = item.task_id;
            row.insertCell(1).innerText = item.project_id;
            row.insertCell(2).innerText = item.description;
            row.insertCell(3).innerText = formatDate(item.start_date); // Format start_date
            row.insertCell(4).innerText = formatDate(item.end_date);   // Format end_date
            row.insertCell(5).innerText = item.status;
            // Add click event listener to each row
            row.addEventListener('click', () => displayTaskRowData(item.task_id));
        });
        console.log("Task Data Loaded");
    } catch (error) {
        console.error('Error fetching task data:', error);
        // Handle error appropriately (e.g., display error message)
    }
}
async function displayTaskRowData(task_id) {
    try {
        console.log('Fetching task data for ID:', task_id);
        const response = await fetch(`http://localhost:3000/tasks/${task_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>${rowData.employee || 'No Employee'}</h2>
            <h2>${rowData.description}</h2>
            <p><strong>Task ID:</strong> ${rowData.task_id}</p>
            <p><strong>Project ID:</strong> ${rowData.project_id}</p>
            <p><strong>Description:</strong> ${rowData.description}</p>
            <p><strong>Start Date:</strong> ${formatDate(rowData.start_date)}</p>
            <p><strong>End Date:</strong> ${formatDate(rowData.end_date)}</p>
            <p><strong>Status:</strong> ${rowData.status}</p>
            <div class="actions">
                <button onclick="editTaskRow(${task_id})">Edit</button>
                <button onclick="deleteTaskRow(${task_id})">Delete</button>
            </div>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error displaying task data:', error);
        alert('Failed to load task data. Please try again.');
    }
}
function insertTaskData() {
    // Implement insert task functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
        <button id="hideButton" onclick="toggleRightPanel()">
            <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
        </button>
        <div class="form-container" id="addForm">
            <label for="projectIdInput">Project ID:</label>
            <input type="text" id="projectIdInput" placeholder="Project ID">
            <label for="taskDescriptionInput">Description:</label>
            <input type="text" id="taskDescriptionInput" placeholder="Description">
            <label for="taskStartDateInput">Start Date:</label>
            <input type="date" id="taskStartDateInput">
            <label for="taskEndDateInput">End Date:</label>
            <input type="date" id="taskEndDateInput">
            <label for="taskStatusInput">Status:</label>
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
async function saveTaskData() {
    let project_id = document.getElementById('projectIdInput').value;
    let description = document.getElementById('taskDescriptionInput').value;
    let start_date = document.getElementById('taskStartDateInput').value;
    let end_date = document.getElementById('taskEndDateInput').value;
    let status = document.getElementById('taskStatusInput').value;

    if (project_id && description && start_date && end_date && status) {
        try {
            // Add the new task
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id,
                    description,
                    start_date,
                    end_date,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const responseData = await response.json();
            const lastAddedTaskId = responseData.task_id; // Assuming the server responds with task_id

            // Display the last added task ID
            displayAddedData(lastAddedTaskId,"Task");

            // Optionally, you can also reload all task data
            loadTaskData();

            // Clear form fields and hide the right panel after saving data
            toggleRightPanel();
            document.getElementById('projectIdInput').value = '';
            document.getElementById('taskDescriptionInput').value = '';
            document.getElementById('taskStartDateInput').value = '';
            document.getElementById('taskEndDateInput').value = '';
            document.getElementById('taskStatusInput').value = '';

            console.log('Task added successfully');
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}
async function editTaskRow(task_id) {
    try {
        console.log('Fetching task data for ID:', task_id);
        const response = await fetch(`http://localhost:3000/tasks/${task_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>Edit Task</h2>
            <form id="editTaskForm">
                <label for="projectIdInput">Project ID:</label>
                <input type="text" id="projectIdInput" value="${rowData.project_id}">
                <label for="taskDescriptionInput">Description:</label>
                <input type="text" id="taskDescriptionInput" value="${rowData.description}">
                <label for="taskStartDateInput">Start Date:</label>
                <input type="date" id="taskStartDateInput" value="${rowData.start_date.split('T')[0]}">
                <label for="taskEndDateInput">End Date:</label>
                <input type="date" id="taskEndDateInput" value="${rowData.end_date.split('T')[0]}">
                <label for="taskStatusInput">Status:</label>
                <input type="text" id="taskStatusInput" value="${rowData.status}">
                <button type="button" onclick="saveEditedTaskData(${task_id})">Save</button>
            </form>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error fetching task data for editing:', error);
        alert('Failed to load task data. Please try again.');
    }
}
async function saveEditedTaskData(task_id) {
    let project_id = document.getElementById('projectIdInput').value;
    let description = document.getElementById('taskDescriptionInput').value;
    let start_date = document.getElementById('taskStartDateInput').value;
    let end_date = document.getElementById('taskEndDateInput').value;
    let status = document.getElementById('taskStatusInput').value;

    if (project_id && description && start_date && end_date && status) {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project_id, description, start_date, end_date, status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            // If successful, reload task data and clear form fields
            loadTaskData();
            toggleRightPanel(); // Hide the right panel after saving data
            console.log('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}
    async function deleteTaskRow(task_id) {
    // Confirm deletion with the user
    if (!confirm(`Are you sure you want to delete task with ID ${task_id}?`)) {
        return;
    }

    try {
        // Send DELETE request to the server
        const response = await fetch(`http://localhost:3000/tasks/${task_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        // Optionally reload task data or update the UI to reflect changes
        toggleRightPanel();
        loadTaskData();

        console.log('Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}
function searchTaskData() {
    // Implement search task functionality
    let searchInput = document.getElementById('taskSearchInput').value;
    alert('Search for task: ' + searchInput);
}

//project DONE
async function loadProjectData() {
    let dataTable = document.getElementById('projectDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    try {
        const response = await fetch('http://localhost:3000/projects');
        if (!response.ok) {
            throw new Error('Failed to fetch project data');
        }
        const projectData = await response.json();

        // Load the data into the table
        projectData.forEach((item, index) => {
            let row = dataTable.insertRow();
            row.insertCell(0).innerText = item.project_id;
            row.insertCell(1).innerText = item.name;
            row.insertCell(2).innerText = item.department_id;
            row.insertCell(3).innerText = formatDate(item.start_date); // Format start_date
            row.insertCell(4).innerText = formatDate(item.end_date);   // Format end_date
            // Add click event listener to each row
            row.addEventListener('click', () => displayProjectRowData(item.project_id));
        });
        console.log("Project Data Loaded");
    } catch (error) {
        console.error('Error fetching project data:', error);
        // Handle error appropriately (e.g., display error message)
    }
}
async function displayProjectRowData(project_id) {
    try {
        console.log('Fetching project data for ID:', project_id);
        const response = await fetch(`http://localhost:3000/projects/${project_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch project data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>${rowData.employee || 'No Employee'}</h2>
            <h2>${rowData.name}</h2>
            <p><strong>Project ID:</strong> ${rowData.project_id}</p>
            <p><strong>Department ID:</strong> ${rowData.department_id}</p>
            <p><strong>Start Date:</strong> ${formatDate(rowData.start_date)}</p>
            <p><strong>End Date:</strong> ${formatDate(rowData.end_date)}</p>
            <div class="actions">
                <button onclick="editProjectRow(${project_id})">Edit</button>
                <button onclick="deleteProjectRow(${project_id})">Delete</button>
            </div>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error displaying project data:', error);
        alert('Failed to load project data. Please try again.');
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
        <button id="hideButton" onclick="toggleRightPanel()">
            <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
        </button>
        <div class="form-container" id="addForm">
            <label for="projectNameInput">Name:</label>
            <input type="text" id="projectNameInput" placeholder="Name">
            <label for="projectDepartmentIdInput">Department ID:</label>
            <input type="text" id="projectDepartmentIdInput" placeholder="Department ID">
            <label for="projectStartDateInput">Start Date:</label>
            <input type="date" id="projectStartDateInput">
            <label for="projectEndDateInput">End Date:</label>
            <input type="date" id="projectEndDateInput">
            <button id="saveProjectButton" onclick="saveProjectData()">Save</button>
        </div>
    `;
    
    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}
async function saveProjectData() {
    let name = document.getElementById('projectNameInput').value;
    let department_id = document.getElementById('projectDepartmentIdInput').value;
    let start_date = document.getElementById('projectStartDateInput').value;
    let end_date = document.getElementById('projectEndDateInput').value;

    if (name && department_id && start_date && end_date) {
        try {
            // Add the new project
            const response = await fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    department_id,
                    start_date: new Date(start_date).toISOString().split('T')[0], // Format date to YYYY-MM-DD
                    end_date: new Date(end_date).toISOString().split('T')[0],     // Format date to YYYY-MM-DD
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add project');
            }

            const responseData = await response.json();
            const lastAddedProjectId = responseData.project_id; // Assuming the server responds with project_id

            // Display the last added project ID
            displayAddedData(lastAddedProjectId,"Project");

            // Optionally, you can also reload all project data
            loadProjectData();

            // Clear form fields and hide the right panel after saving data
            toggleRightPanel();
            document.getElementById('projectNameInput').value = '';
            document.getElementById('projectDepartmentIdInput').value = '';
            document.getElementById('projectStartDateInput').value = '';
            document.getElementById('projectEndDateInput').value = '';

            console.log('Project added successfully');
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to add project. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}
async function editProjectRow(project_id) {
    try {
        console.log('Fetching project data for ID:', project_id);
        const response = await fetch(`http://localhost:3000/projects/${project_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch project data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>Edit Project</h2>
            <form id="editProjectForm">
                <label for="projectIdInput">Project ID:</label>
                <input type="text" id="projectIdInput" value="${rowData.project_id}">
                <label for="projectNameInput">Name:</label>
                <input type="text" id="projectNameInput" value="${rowData.name}">
                <label for="projectDepartmentIdInput">Department ID:</label>
                <input type="text" id="projectDepartmentIdInput" value="${rowData.department_id}">
                <label for="projectStartDateInput">Start Date:</label>
                <input type="date" id="projectStartDateInput" value="${rowData.start_date.split('T')[0]}">
                <label for="projectEndDateInput">End Date:</label>
                <input type="date" id="projectEndDateInput" value="${rowData.end_date.split('T')[0]}">
                <button type="button" onclick="saveEditedProjectData(${project_id})">Save</button>
            </form>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error fetching project data for editing:', error);
        alert('Failed to load project data. Please try again.');
    }
}
async function deleteProjectRow(project_id) {
    // Confirm deletion with the user
    if (!confirm(`Are you sure you want to delete project with ID ${project_id}?`)) {
        return;
    }

    try {
        // Send DELETE request to the server
        const response = await fetch(`http://localhost:3000/projects/${project_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }

        // Optionally reload project data or update the UI to reflect changes
        toggleRightPanel();
        loadProjectData(); // Assuming this function reloads project data

        console.log('Project deleted successfully');
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
    }
}
async function saveEditedProjectData(project_id) {
    let name = document.getElementById('projectNameInput').value;
    let department_id = document.getElementById('projectDepartmentIdInput').value;
    let start_date = document.getElementById('projectStartDateInput').value;
    let end_date = document.getElementById('projectEndDateInput').value;

    if (name && department_id && start_date && end_date) {
        try {
            const response = await fetch(`http://localhost:3000/projects/${project_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, department_id, start_date, end_date }),
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            // If successful, reload project data and clear form fields
            loadProjectData();
            toggleRightPanel(); // Hide the right panel after saving data
            console.log('Project updated successfully');
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

//employee
//done
async function loadEmployeeData() {
    let dataTable = document.getElementById('employeeDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    try {
        const response = await fetch('http://localhost:3000/employees');
        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }
        const employeeData = await response.json();

        // Load the data into the table
        employeeData.forEach((item, index) => {
            let row = dataTable.insertRow();
            row.insertCell(0).innerText = item.employee_id;
            row.insertCell(1).innerText = item.name;
            row.insertCell(2).innerText = item.department_id;
            row.insertCell(3).innerText = item.position;
            row.insertCell(4).innerText = formatDate(item.hire_date); // Format hire_date
            // Add click event listener to each row
            row.addEventListener('click', () => displayEmployeeRowData(item.employee_id));
        });
        console.log("Employee Data Loaded");
    } catch (error) {
        console.error('Error fetching employee data:', error);
        // Handle error appropriately (e.g., display error message)
    }
}
//done
async function displayEmployeeRowData(employee_id) {
    try {
        console.log('Fetching employee data for ID:', employee_id);
        const response = await fetch(`http://localhost:3000/employees/${employee_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>${rowData.name}</h2>
            <p><strong>Employee ID:</strong> ${rowData.employee_id}</p>
            <p><strong>Department ID:</strong> ${rowData.department_id}</p>
            <p><strong>Position:</strong> ${rowData.position}</p>
            <p><strong>Hire Date:</strong> ${formatDate(rowData.hire_date)}</p>
            <div class="actions">
                <button onclick="editEmployeeRow(${employee_id})">Edit</button>
                <button onclick="deleteEmployeeRow(${employee_id})">Delete</button>
            </div>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error displaying employee data:', error);
        alert('Failed to load employee data. Please try again.');
    }
}
//done
function insertEmployeeData() {
    // Implement insert employee functionality
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
        <button id="hideButton" onclick="toggleRightPanel()">
            <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
        </button>
        <div class="form-container" id="addForm">
            <input type="text" id="employeeNameInput" placeholder="Name">
            <input type="text" id="employeeDepartmentIdInput" placeholder="Department ID">
            <input type="text" id="employeePositionInput" placeholder="Position">
            <input type="date" id="employeeHireDateInput" placeholder="Hire Date">
            <button id="saveEmployeeButton" onclick="saveEmployeeData()">Save</button>
        </div>
    `;

    // Check if #rightPanel is hidden before toggling
    let rightPanel = document.getElementById('rightPanel');
    if (rightPanel.classList.contains('hidden')) {
        toggleRightPanel();
    }
}
//done
async function editEmployeeRow(employee_id) {
    try {
        console.log('Fetching employee data for ID:', employee_id);
        const response = await fetch(`http://localhost:3000/employees/${employee_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()">
                <i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i>
            </button>
            <h2>Edit Employee</h2>
            <form id="editEmployeeForm">
                <label for="employeeNameInput">Name:</label>
                <input type="text" id="employeeNameInput" value="${rowData.name}">
                <label for="employeeDepartmentIdInput">Department ID:</label>
                <input type="text" id="employeeDepartmentIdInput" value="${rowData.department_id}">
                <label for="employeePositionInput">Position:</label>
                <input type="text" id="employeePositionInput" value="${rowData.position}">
                <label for="employeeHireDateInput">Hire Date:</label>
                <input type="date" id="employeeHireDateInput" value="${rowData.hire_date.split('T')[0]}">
                <button type="button" onclick="saveEditedEmployeeData(${employee_id})">Save</button>
            </form>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error fetching employee data for editing:', error);
        alert('Failed to load employee data. Please try again.');
    }
}
//done
async function deleteEmployeeRow(employee_id) {
    // Confirm deletion with the user
    if (!confirm(`Are you sure you want to delete employee with ID ${employee_id}?`)) {
        return;
    }

    try {
        // Send DELETE request to the server
        const response = await fetch(`http://localhost:3000/employees/${employee_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }

        // Optionally reload employee data or update the UI to reflect changes
        toggleRightPanel();
        loadEmployeeData();

        console.log('Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
    }
}
//done
async function saveEmployeeData() {
    let name = document.getElementById('employeeNameInput').value;
    let department_id = document.getElementById('employeeDepartmentIdInput').value;
    let position = document.getElementById('employeePositionInput').value;
    let hire_date = document.getElementById('employeeHireDateInput').value;

    if (name && department_id && position && hire_date) {
        try {
            const response = await fetch('http://localhost:3000/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    department_id,
                    position,
                    hire_date,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            const responseData = await response.json();
            const lastAddedEmployeeId = responseData.employee_id; // Assuming the server responds with employee_id

            // Display the last added employee ID
            displayAddedData(lastAddedEmployeeId,"Employee");

            // Optionally, you can also reload all employee data
            loadEmployeeData();

            // Clear form fields and hide the right panel after saving data
            toggleRightPanel();
            document.getElementById('employeeNameInput').value = '';
            document.getElementById('employeeDepartmentIdInput').value = '';
            document.getElementById('employeePositionInput').value = '';
            document.getElementById('employeeHireDateInput').value = '';

            console.log('Employee added successfully');
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}
//done
async function saveEditedEmployeeData(employee_id) {
    let name = document.getElementById('employeeNameInput').value;
    let department_id = document.getElementById('employeeDepartmentIdInput').value;
    let position = document.getElementById('employeePositionInput').value;
    let hire_date = document.getElementById('employeeHireDateInput').value;

    if (name && department_id && position && hire_date) {
        try {
            const response = await fetch(`http://localhost:3000/employees/${employee_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, department_id, position, hire_date }),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            // If successful, reload employee data and clear form fields
            loadEmployeeData();
            toggleRightPanel(); // Hide the right panel after saving data
            console.log('Employee updated successfully');
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}
//done
function searchEmployeeData() {
    // Implement search employee functionality
    let searchInput = document.getElementById('employeeSearchInput').value;
    alert('Search for: ' + searchInput);
}

//department
//done
async function loadDepartmentData() {
    let dataTable = document.getElementById('departmentDataTable');
    dataTable.innerHTML = "";  // Clear all rows

    try {
        const response = await fetch('http://localhost:3000/departments');
        if (!response.ok) {
            throw new Error('Failed to fetch department data');
        }
        const departmentData = await response.json();

        // Load the data into the table
        departmentData.forEach((item, index) => {
            let row = dataTable.insertRow();
            row.insertCell(0).innerText = item.department_id;
            row.insertCell(1).innerText = item.name;
            row.insertCell(2).innerText = item.manager_name;
            row.insertCell(3).innerText = item.location;
            // Add click event listener to each row
            row.addEventListener('click', () => displayDepartmentRowData(item.department_id));
        });
        console.log("Department Data Loaded");
    } catch (error) {
        console.error('Error fetching department data:', error);
        // Handle error appropriately (e.g., display error message)
    }
}
//done
async function displayDepartmentRowData(department_id) {
    try {
        console.log('Fetching department data for ID:', department_id);
        const response = await fetch(`http://localhost:3000/departments/${department_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch department data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
            <h2>${rowData.name}</h2>
            <p><strong>Department ID:</strong> ${rowData.department_id}</p>
            <p><strong>Manager (Employee ID):</strong> ${rowData.manager_name}</p>
            <p><strong>Location (Building Number):</strong> ${rowData.location}</p>
            <div class="actions">
                <button onclick="editDepartmentRow(${department_id})">Edit</button>
                <button onclick="deleteDepartmentRow(${department_id})">Delete</button>
            </div>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error displaying department data:', error);
        alert('Failed to load department data. Please try again.');
    }
}
//done
function insertDepartmentData() {
    // Show the form in the right panel
    document.getElementById('rightPanel').innerHTML = `
        <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></i></button>
        <div class="form-container" id="addForm">
            <input type="text" id="departmentNameInput" placeholder="Name">
            <input type="text" id="departmentManagerInput" placeholder="Manager">
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
//done
async function editDepartmentRow(department_id) {
    try {
        console.log('Fetching department data for ID:', department_id);
        const response = await fetch(`http://localhost:3000/departments/${department_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch department data');
        }
        const rowData = await response.json();

        document.getElementById('rightPanel').innerHTML = `
            <button id="hideButton" onclick="toggleRightPanel()"><i class="fa-solid fa-chevron-left fa-2xs" style="color: #333333;"></i></button>
            <h2>Edit Department</h2>
            <form id="editDepartmentForm">
                <input type="text" id="departmentNameInput" value="${rowData.name}">
                <input type="text" id="departmentManagerInput" value="${rowData.manager_name}">
                <input type="text" id="departmentLocationInput" value="${rowData.location}">
                <button type="button" onclick="saveEditedDepartmentData(${department_id})">Save</button>
            </form>
        `;

        // Check if #rightPanel is hidden before toggling
        let rightPanel = document.getElementById('rightPanel');
        if (rightPanel.classList.contains('hidden')) {
            toggleRightPanel();
        }
    } catch (error) {
        console.error('Error fetching department data for editing:', error);
        alert('Failed to load department data. Please try again.');
    }
}
//done
async function deleteDepartmentRow(department_id) {
    // Confirm deletion with the user
    if (!confirm(`Are you sure you want to delete department with ID ${department_id}?`)) {
        return;
    }

    try {
        // Send DELETE request to the server
        const response = await fetch(`http://localhost:3000/departments/${department_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete department');
        }

        // Optionally reload department data or update the UI to reflect changes
        toggleRightPanel();
        loadDepartmentData();

        console.log('Department deleted successfully');
    } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department. Please try again.');
    }
}
//done
async function saveDepartmentData() {
    let name = document.getElementById('departmentNameInput').value;
    let manager_name = document.getElementById('departmentManagerInput').value;
    let location = document.getElementById('departmentLocationInput').value;

    if (name && manager_name && location) {
        try {
            const response = await fetch('http://localhost:3000/departments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    manager_name,
                    location,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add department');
            }
            const responseData = await response.json();
            const lastID = responseData.department_id; // Assuming the server responds with task_id

            displayAddedData(lastID,"Department");
            // Optionally, you can also reload all department data
            loadDepartmentData();

            // Clear form fields and hide the right panel after saving data
            toggleRightPanel();
            document.getElementById('departmentNameInput').value = '';
            document.getElementById('departmentManagerInput').value = '';
            document.getElementById('departmentLocationInput').value = '';

            console.log('Department added successfully');
        } catch (error) {
            console.error('Error adding department:', error);
            alert('Failed to add department. Please try again.');
        }
    } else {
        alert("Please fill in all fields.");
    }
}

//done
async function saveEditedDepartmentData(department_id) {
    let name = document.getElementById('departmentNameInput').value;
    let manager_name = document.getElementById('departmentManagerInput').value;
    let location = document.getElementById('departmentLocationInput').value;

    if (name && manager_name && location) {
        try {
            const response = await fetch(`http://localhost:3000/departments/${department_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, manager_name, location }),
            });

            if (!response.ok) {
                throw new Error('Failed to update department');
            }

            // If successful, reload department data and clear form fields
            loadDepartmentData();
            toggleRightPanel(); // Hide the right panel after saving data
            console.log('Department updated successfully');
        } catch (error) {
            console.error('Error updating department:', error);
            alert('Failed to update department. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

function searchDepartmentData() {
    // Implement search department functionality
    let searchInput = document.getElementById('departmentSearchInput').value;
    alert('Search for: ' + searchInput);
}



function addNavBarEventListeners() {
    document.getElementById('dashboardButton').addEventListener('click', () => {
        displaySection('dashboardContent');
        loadData();
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
        document.getElementById(sectionId).style.display = 'block';
}
// Function to add data based on selected category
async function insertData() {
    const category = document.getElementById('categorySelect').value;
        switch (category) {
            case 'employee':
                 insertEmployeeData();
                break;
            case 'department':
                 insertDepartmentData();
                break;
            case 'project':
                 insertProjectData();
                break;
            case 'task':
                 insertTaskData();
                break;
            default:
                throw new Error('Invalid category');
        }
}

let nextNumberID = 1; // Initialize NumberID counter

// Function to add data based on selected category
// Example usage after adding new data
async function displayAddedData(id,category) {

    try {
        const response = await fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: category,
                type_id: id,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add data');
        }

        // Optionally, handle response from server
        const insertedData = await response.json();
        console.log('Data added successfully:', insertedData);

        // Reload data in the table after successful addition
        loadData();

    } catch (error) {
        console.error('Error adding data:', error);
        alert('Failed to add data. Please try again.');
    }
}

async function loadData() {
    const dataTable = document.getElementById('addedDataBody');
    dataTable.innerHTML = "";  // Clear all rows

    try {
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        let data = await response.json();

        // Reverse the data array to load from last to first
        data.reverse();

        // Load the data into the table
        data.forEach((item, index) => {
            let row = dataTable.insertRow();

            // Insert cells in reverse order
            row.insertCell(0).innerText = item.data_id;
            row.insertCell(1).innerText = item.type;
            row.insertCell(2).innerText = item.type_id;

            // Add click event listener to each row
            row.addEventListener('click', () => redirectToDetailsPage(item.type, item.type_id));
        });

        console.log("Data Loaded in reverse order");
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error appropriately (e.g., display error message)
    }
}



function redirectToDetailsPage(type, id) {
    switch (type) {
        case 'employee':
            displaySection('employeeContent');
            loadEmployeeData(); // Load employee data when the Employee section is displayed
            break;
        case 'department':
            displaySection('departmentContent');
            loadDepartmentData(); // Load department data when the Department section is displayed
            break;
        case 'project':
            displaySection('projectContent');
            loadProjectData(); // Load project data when the Project section is displayed
            break;
        case 'task':
            displaySection('taskContent');
            loadTaskData(); // Load task data when the Task section is displayed
            break;
        default:
            console.error(`Unsupported type: ${type}`);
    }
}





