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

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        const table = cTable.getTable(results);
        console.info(table);
    });
};

module.exports = viewEmployees;