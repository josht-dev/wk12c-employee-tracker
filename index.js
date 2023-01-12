// *****Load modules*****
const inquirer = require('inquirer');
require('dotenv').config();
const viewEmployees = require('./utils/db-utilites');

// *****Global variables*****
const PORT = process.env.PORT || 3001;
// Menu prompt for inquirer package
const menuPrompt = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menuSelect',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit'
        ],
        filter: function(menuSelect) {
            switch (menuSelect) {
                case 'View All Employees':
                    return 'viewEmployees';
                    break;
                case 'Add Employee':
                    return 'addEmployee';
                    break;
                case 'Update Employee Role':
                    return 'updateRole';
                    break;
                case 'View All Roles':
                    return 'viewRoles';
                    break;
                case 'Add Role':
                    return 'addRole';
                    break;
                case 'View All Departments':
                    return 'viewDepartments';
                    break;
                case 'Add Department':
                    return 'addDepartment';
                    break;
                default:
                    return 'quit';
                    break;
            }
        }
    }
];

// *****Run code at load*****

async function menu () {
    const answer = await inquirer.prompt(menuPrompt);

    viewEmployees();

};

menu();