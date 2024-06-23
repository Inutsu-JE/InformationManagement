GROUP 9
Leader: Cartagenas

Members:Epistola
        Ruedas
        Sibayan
        Marasigan

MIS FINAL PROJECT

NOTE: if you will run this on your pc, please create a db on your sql server to properly use the program

you can add a db via sql workbench or via cmd or powershell(but make sure you have the sql bin folder on your System Environment Path)
you can edit your environment path by opening Edit the System Environment Variables, click environment variables, select path on the 
System Variables, click edit and past your sql bin folder, then select ok. If you can't find the bin folder then you can just use the 
location of your sql installation, to get the location right click the sql icon then click open file location the location should look
like this C:\Program Files\MySQL\MySQL Workbench 8.0 CE, also make sure you have install the mySQL SERVER

then you can run the cmd or powershell as administrator then enter the following commands

  mysql -u yourusername(normally root) -p
  enteryourpassword:

  then you can now create the database and the tables

  -- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS companydb;

-- Step 2: Use the database
USE companydb;

-- Step 3: Drop existing tables to start fresh (optional)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS data;

-- Step 4: Create the tables

-- Creating Departments Table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    manager_name VARCHAR(100),
    location VARCHAR(100)
);

-- Creating Employees Table
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    position VARCHAR(100),
    hire_date DATE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Creating Projects Table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Creating Tasks Table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Creating Data Table
CREATE TABLE data (
    data_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    type_id INT NOT NULL
);

before running the server make sure to edit the server.js with your sql details

// MySQL Connection Setup
const connection = mysql.createConnection({
    host: 'localhost', //edit this
    user: 'root',//edit this
    password: 'evanpogi',//edit this 
    database: 'companydb'
  });

now you can run the server.js 
to run the server go to cmd as administrator then enter the following commands, make sure that you have node.js installed in your pc

cd (the directory) Example:InformationManagement\public\server

then enter

node server.js

now you can test the website -NOTE- admin admin is the user and pass of the site

