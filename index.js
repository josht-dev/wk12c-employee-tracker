// *****Load modules*****
const inquirer = require('inquirer');
require('dotenv').config();
const { viewTable, getDepartments, getRoles, getManagers } = require('./utils/db-utilites');

// *****Global variables*****
const PORT = process.env.PORT || 3001;

const getChoices = async (type) => {
    let val = '';
    switch (type) {
        case 'departments':
            val = await getDepartments();
            break;
        case 'roles':
            val = await getRoles();
            break;
        case 'managers':
            val = await getManagers();
            break;
        default:
            break;
    }
    return val[0];
}

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
    },
    {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'departmentName',
        when: function(answer) {
            return (answer.menuSelect === 'addDepartment') ? true : false;
        }
    },
    {
        type: 'input',
        message: 'What is the title of the new role?',
        name: 'roleTitle',
        when: function(answer) {
            return (answer.menuSelect === 'addRole') ? true : false;
        }
    },
    {
        type: 'number',
        message: 'What is the salary of the new role?',
        name: 'roleSalary',
        when: function(answer) {
            return (answer.menuSelect === 'addRole') ? true : false;
        }
    },
    {
        type: 'list',
        message: 'Which department uses the new role?',
        name: 'roleDepartment',
        choices: function (choices) {
            choices = getChoices('departments');
            return choices;
        },
        when: function(answer) {
            return (answer.menuSelect === 'addRole') ? true : false;
        }
    },
    {
        type: 'input',
        message: "Employee's first name?",
        name: 'employeeFirstName',
        when: function(answer) {
            return (answer.menuSelect === 'addEmployee') ? true : false;
        }
    },
    {
        type: 'input',
        message: "Employee's last name?",
        name: 'employeeLastName',
        when: function(answer) {
            return (answer.menuSelect === 'addEmployee') ? true : false;
        }
    },
    {
        type: 'list',
        message: "Employee's title:",
        name: 'employeeTitle',
        choices: function (choices) {
            choices = getChoices('roles');
            return choices;
        },
        when: function(answer) {
            return (answer.menuSelect === 'addEmployee') ? true : false;
        }
    },
    {
        type: 'confirm',
        message: 'Does the employee have a manager?',
        name: 'employeeManaged',
        when: function(answer) {
            return (answer.menuSelect === 'addEmployee') ? true : false;
        }
    },
    {
        type: 'list',
        message: "Select the employee's manager:",
        name: 'employeeManager',
        choices: function (choices) {
            choices = getChoices('managers');
            return choices;
        },
        when: function(answer) {
            return (answer.employeeManaged);
        }
    }
];

// *****Run code at load*****

// Display the menu to the user
async function menu () {
    let quit = false;

    // User prompts will continue till the user chooses to 'quit'
    do {
        // Prompt the user with the menu
        let answer = await inquirer.prompt(menuPrompt);

        // Check user's choices
        switch (answer.menuSelect) {
            case 'viewEmployees':
                viewTable('employees');
                break;
            case 'addEmployee':
                return 'addEmployee';
                break;
            case 'updateRole':
                return 'updateRole';
                break;
            case 'viewRoles':
                viewTable('roles');
                break;
            case 'addRole':
                return 'addRole';
                break;
            case 'viewDepartments':
                viewTable('departments');
                break;
            case 'addDepartment':
                return 'addDepartment';
                break;
            default:
                // User is finished
                quit = true;
                break;
        }
    } while (!quit);
    console.info('Good Bye! Have a wonderful rest of your day!');
};

menu();