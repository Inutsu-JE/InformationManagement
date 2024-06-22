const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const pool = require('./db/connection'); // Adjust the path as necessary

const app = express();
const port = 3000;

// MySQL Connection Setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'evanpogi13',
    database: 'companydb'
  });
  
  // Connect to MySQL
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }
    console.log('Connected to MySQL database as id', connection.threadId);
  });

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to insert data into the specified table
const insertData = (table, data, res) => {
    connection.query(`INSERT INTO ?? SET ?`, [table, data], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(`${table} data added successfully`);
    });
};

//employees
// Employees

// Create: Add a new employee
app.post('/employees', (req, res) => {
    const { name, department_id, position, hire_date } = req.body;

    // Example SQL query to insert employee data into database
    const sql = 'INSERT INTO employees (name, department_id, position, hire_date) VALUES (?, ?, ?, ?)';
    const values = [name, department_id, position, hire_date];

    // Execute the query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting employee:', err);
            res.status(500).send('Error inserting employee into database');
            return;
        }

        const insertedEmployeeId = result.insertId; // Get the last inserted ID

        console.log('Employee inserted successfully:', result);
        res.status(200).json({
            message: 'Employee inserted successfully',
            employee_id: insertedEmployeeId  // Send the inserted employee_id in the response
        });
    });
});

// Read: Get all employees
app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM employees'; // Example SQL query to fetch employees
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({ error: 'Failed to fetch employees' });
            return;
        }
  
        res.json(results); // Send employees data as JSON response
    });
});

// Read: Get a single employee by ID
app.get('/employees/:id', (req, res) => {
    const employee_id = req.params.id;

    const query = 'SELECT * FROM employees WHERE employee_id = ?';
    connection.query(query, [employee_id], (error, results) => {
        if (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({ error: 'Failed to fetch employee' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        res.json(results[0]); // Send the employee data as JSON response
    });
});

// Update: Update an existing employee
app.put('/employees/:id', (req, res) => {
    const employee_id = req.params.id;
    const { name, department_id, position, hire_date } = req.body;
    const employeeData = { name, department_id, position, hire_date };

    connection.query('UPDATE employees SET ? WHERE employee_id = ?', [employeeData, employee_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Employee with ID ${employee_id} updated successfully`);
    });
});

// Delete: Delete an existing employee
app.delete('/employees/:id', (req, res) => {
    const employee_id = req.params.id;

    connection.query('DELETE FROM employees WHERE employee_id = ?', [employee_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Employee with ID ${employee_id} deleted successfully`);
    });
});


// Departments

// Create: Add a new department
app.post('/departments', (req, res) => {
    const { name, manager, location } = req.body;

    // Example SQL query to insert department data into database
    const sql = 'INSERT INTO departments (name, manager, location) VALUES (?, ?, ?)';
    const values = [name, manager, location];

    // Execute the query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting department:', err);
            res.status(500).send('Error inserting department into database');
            return;
        }

        const insertedDepartmentId = result.insertId; // Get the last inserted ID

        console.log('Department inserted successfully:', result);
        res.status(200).json({
            message: 'Department inserted successfully',
            department_id: insertedDepartmentId  // Send the inserted department_id in the response
        });
    });
});


// Read: Get all departments
app.get('/departments', (req, res) => {
    const query = 'SELECT * FROM departments'; // Example SQL query to fetch departments
  
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({ error: 'Failed to fetch departments' });
            return;
        }
  
        res.json(results); // Send departments data as JSON response
    });
});

// Read: Get a single department by ID
app.get('/departments/:id', (req, res) => {
    const department_id = req.params.id;

    const query = 'SELECT * FROM departments WHERE department_id = ?';
    connection.query(query, [department_id], (error, results) => {
        if (error) {
            console.error('Error fetching department:', error);
            res.status(500).json({ error: 'Failed to fetch department' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Department not found' });
            return;
        }
        res.json(results[0]); // Send the department data as JSON response
    });
});

// Update: Update an existing department
app.put('/departments/:id', (req, res) => {
    const department_id = req.params.id;
    const { name, manager, location } = req.body;
    const departmentData = { name, manager, location };

    connection.query('UPDATE departments SET ? WHERE department_id = ?', [departmentData, department_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Department with ID ${department_id} updated successfully`);
    });
});

// Delete: Delete an existing department
app.delete('/departments/:id', (req, res) => {
    const department_id = req.params.id;

    connection.query('DELETE FROM departments WHERE department_id = ?', [department_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Department with ID ${department_id} deleted successfully`);
    });
});


//Projects
// Create: Add a new project
app.post('/projects', (req, res) => {
    const { name, department_id, start_date, end_date } = req.body;

    // Example SQL query to insert project data into database (excluding project_id)
    const sql = 'INSERT INTO projects (name, department_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    const values = [name, department_id, start_date, end_date];

    // Execute the query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting project:', err);
            res.status(500).send('Error inserting project into database');
            return;
        }
        
        console.log('Project inserted successfully:', result);
        const insertedProjectId = result.insertId; // Get the auto-incremented project_id

        res.status(201).json({
            message: 'Project inserted successfully',
            project_id: insertedProjectId  // Send the inserted project_id in the response
        });
    });
});

// Read: Get all projects
app.get('/projects', (req, res) => {
    connection.query('SELECT * FROM projects', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});


// Read: Get a single project by ID
app.get('/projects/:id', (req, res) => {
    const project_id = req.params.id;

    const query = 'SELECT * FROM projects WHERE project_id = ?';
    connection.query(query, [project_id], (error, results) => {
        if (error) {
            console.error('Error fetching project:', error);
            return res.status(500).json({ error: 'Failed to fetch project' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(results[0]); // Send the project data as JSON response
    });
});


// Update: Update an existing project
app.put('/projects/:id', (req, res) => {
    const project_id = req.params.id;
    const { name, department_id, start_date, end_date } = req.body;
    const projectData = { name, department_id, start_date, end_date };
    
    connection.query('UPDATE projects SET ? WHERE project_id = ?', [projectData, project_id], (err, results) => {
        if (err) {
            console.error('Error updating project:', err);
            return res.status(500).send('Failed to update project');
        }
        res.status(200).send(`Project with ID ${project_id} updated successfully`);
    });
});


// Delete: Delete an existing project
app.delete('/projects/:id', (req, res) => {
    const project_id = req.params.id;
    
    connection.query('DELETE FROM projects WHERE project_id = ?', [project_id], (err, results) => {
        if (err) {
            console.error('Error deleting project:', err);
            return res.status(500).send('Failed to delete project');
        }
        res.status(200).send(`Project with ID ${project_id} deleted successfully`);
    });
});

//Tasks
// Example POST route for inserting task data
app.post('/tasks', (req, res) => {
    const { project_id, description, start_date, end_date, status } = req.body;

    // Example SQL query to insert task data into database
    const sql = 'INSERT INTO tasks (project_id, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [project_id, description, start_date, end_date, status];

    // Execute the query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            res.status(500).send('Error inserting task into database');
            return;
        }
        
        const insertedTaskId = result.insertId; // Get the last inserted ID

        console.log('Task inserted successfully:', result);
        res.status(200).json({
            message: 'Task inserted successfully',
            task_id: insertedTaskId  // Send the inserted task_id in the response
        });
    });
});


// Read: Get all tasks
// Route to fetch tasks
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks'; // Example SQL query to fetch tasks
  
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
        return;
      }
  
      res.json(results); // Send tasks data as JSON response
    });
  });

// Read: Get a single task by ID
    app.get('/tasks/:id', (req, res) => {
        const task_id = req.params.id;

        const query = 'SELECT * FROM tasks WHERE task_id = ?';
        connection.query(query, [task_id], (error, results) => {
            if (error) {
                console.error('Error fetching task:', error);
                res.status(500).json({ error: 'Failed to fetch task' });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json(results[0]); // Send the task data as JSON response
        });
    });



// Update: Update an existing task
app.put('/tasks/:id', (req, res) => {
    const task_id = req.params.id;
    const { project_id, description, start_date, end_date, status } = req.body;
    const taskData = { project_id, description, start_date, end_date, status };
    
    connection.query('UPDATE tasks SET ? WHERE task_id = ?', [taskData, task_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Task with ID ${task_id} updated successfully`);
    });
});

// Delete: Delete an existing task
app.delete('/tasks/:id', (req, res) => {
    const task_id = req.params.id;

    connection.query('DELETE FROM tasks WHERE task_id = ?', [task_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Task with ID ${task_id} deleted successfully`);
    });
});

app.post('/data', (req, res) => {
    const { type, type_id } = req.body;

    // Example SQL query to insert data into database
    const sql = 'INSERT INTO data (type, type_id) VALUES (?, ?)';
    const values = [type, type_id];

    // Execute the query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data into database');
            return;
        }

        const insertedDataId = result.insertId; // Get the last inserted ID

        console.log('Data inserted successfully:', result);
        res.status(200).json({
            message: 'Data inserted successfully',
            data_id: insertedDataId  // Send the inserted data_id in the response
        });
    });
});
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM data'; // Example SQL query to fetch all data

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }

        res.json(results); // Send data as JSON response
    });
});
app.get('/data/:id', (req, res) => {
    const data_id = req.params.id;

    const query = 'SELECT * FROM data WHERE data_id = ?';
    connection.query(query, [data_id], (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }
        res.json(results[0]); // Send data as JSON response
    });
});
app.put('/data/:id', (req, res) => {
    const data_id = req.params.id;
    const { type, type_id } = req.body;
    const dataToUpdate = { type, type_id };

    connection.query('UPDATE data SET ? WHERE data_id = ?', [dataToUpdate, data_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Data with ID ${data_id} updated successfully`);
    });
});
app.delete('/data/:id', (req, res) => {
    const data_id = req.params.id;

    connection.query('DELETE FROM data WHERE data_id = ?', [data_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Data with ID ${data_id} deleted successfully`);
    });
});

// Define a search route to search across all relevant tables
app.get('/search/:searchTerm', (req, res) => {
    const searchTerm = req.params.searchTerm;
    
    // Example SQL query to search across tables
    const query = `
        SELECT name, position, 'employee' AS type FROM employees WHERE name LIKE ?
        UNION
        SELECT name, manager AS position, 'department' AS type FROM departments WHERE name LIKE ?
        UNION
        SELECT name, '' AS position, 'project' AS type FROM projects WHERE name LIKE ?
        UNION
        SELECT description AS name, 'task' AS position, 'task' AS type FROM tasks WHERE description LIKE ?
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
    
    // Execute the query
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error searching:', error);
            res.status(500).json({ error: 'Failed to search' });
            return;
        }
        res.json(results); // Send search results as JSON response
    });
});
