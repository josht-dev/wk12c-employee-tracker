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

// DB view queries
const viewTable = (employeeTable) => {
    db.query(`SELECT * FROM ${employeeTable}`, function(err, results) {
        const table = cTable.getTable(results);
        console.info(table);
    });
}

const viewByManager = (manager) => {
    db.query(`SELECT * FROM employee WHERE manager_id = ${manager}`, function(err, results) {
        const table = cTable.getTable(results);
        console.info(table);
    });
};

// DB adds

// DB updates

// DB deletes

module.exports = {viewTable, viewByManager};