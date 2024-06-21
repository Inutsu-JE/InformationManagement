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
// Create: Add a new employee
app.post('/employees', (req, res) => {
    const { employee_id, name, department_id, position, hire_date } = req.body;
    const employeeData = { employee_id, name, department_id, position, hire_date };
    insertData('employees', employeeData, res);
    console.log("EMPLOYEE ADDED");
});

// Read: Get all employees
app.get('/employees', (req, res) => {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
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

//departments
// Create: Add a new department
app.post('/departments', (req, res) => {
    const { department_id, name, manager, location } = req.body;
    const departmentData = { department_id, name, manager, location };
    insertData('departments', departmentData, res);
});

// Read: Get all departments
app.get('/departments', (req, res) => {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
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
    const { project_id, name, department_id, start_date, end_date } = req.body;
    const projectData = { project_id, name, department_id, start_date, end_date };
    insertData('projects', projectData, res);
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

// Update: Update an existing project
app.put('/projects/:id', (req, res) => {
    const project_id = req.params.id;
    const { name, department_id, start_date, end_date } = req.body;
    const projectData = { name, department_id, start_date, end_date };
    
    connection.query('UPDATE projects SET ? WHERE project_id = ?', [projectData, project_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`Project with ID ${project_id} updated successfully`);
    });
});

// Delete: Delete an existing project
app.delete('/projects/:id', (req, res) => {
    const project_id = req.params.id;
    
    connection.query('DELETE FROM projects WHERE project_id = ?', [project_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
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
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            res.status(500).send('Error inserting task into database');
            return;
        }
        console.log('Task inserted successfully:', result);
        res.status(200).send('Task inserted successfully');
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
