// *****Load modules*****
const mysql = require('mysql2');
const cTable = require('console.table');
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
        case 'role':
            queryStr = 'SELECT * FROM role';
            break;
        case 'department':
            queryStr = 'SELECT * FROM department';
        /*case 'manager':
            queryStr = `SELECT * FROM employee WHERE manager_id = ${dbTable}`;
            break;
        */
        default:
            break;
    }

    db.query(queryStr, function(err, results) {
        const table = cTable.getTable(results);
        console.info(table);
    });
}

// DB get data values
const getDepartments = () => {
    db.query('SELECT id, name FROM department', function(err, results) {
        return results;
    });
};

const getRoles = () => {
    db.query('SELECT id, title AS name FROM role', function(err, results) {
        return results;
    });
};

const getManagers = () => {
    db.query(`SELECT id, CONCAT(employee.first_name,' ',employee.last_name) AS name FROM employee`, function(err, results) {
        return results;
    });
};

// DB adds

// DB updates

// DB deletes

module.exports = {
    viewTable,
    getDepartments,
    getRoles,
    getManagers
};