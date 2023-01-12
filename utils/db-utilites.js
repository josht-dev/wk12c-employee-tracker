// *****Load modules*****
const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

// DB view tables
const viewTable = (dbTable) => {
    // Determine which SQL query string to use
    let queryStr = '';
    switch (dbTable) {
        case 'employees':
            queryStr = 
                `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS full_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`;
            break;
        case 'roles':
            queryStr = 'SELECT * FROM role';
            break;
        case 'departments':
            queryStr = 'SELECT * FROM department';
        /*case 'manager':
            queryStr = `SELECT * FROM employee WHERE manager_id = ${dbTable}`;
            break;
        */
        default:
            break;
    }

    let query = db.promise().query(queryStr);
    return query;
}

// DB get data values
let getDepartments = () => {
    let query = db.promise().query('SELECT name, id AS value FROM department');
    return query;
};

const getRoles = () => {
    let query = db.promise().query('SELECT id AS value, title AS name FROM role');
    return query;
};

// TODO - filter managers by department
const getManagers = () => {
    let query = db.promise().query(`SELECT id AS value, CONCAT(employee.first_name,' ',employee.last_name) AS name FROM employee`);
    return query;
};

// DB adds
const addDepartment = (name) => {
    let query = db.promise().query(`INSERT INTO department(name) VALUES ("${name}")`);
    return;
}

const addRole = (title, salary, department) => {
    let query = db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES ("${title}", "${salary}", "${department}")`);
    return;
}

const addEmployee = (firstName, lastName, role, manager) => {
    let query = db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${role}", "${manager}")`);
    return;
}

// DB updates

// DB deletes

module.exports = {
    viewTable,
    getDepartments,
    getRoles,
    getManagers,
    addDepartment,
    addRole,
    addEmployee
};