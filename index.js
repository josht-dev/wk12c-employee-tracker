// *****Load modules*****
const inquirer = require('inquirer');
const cTable = require('console.table');
const { 
    viewTable, 
    getDepartments, 
    getRoles, 
    getManagers, 
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    employeeRoleUpdate
 } = require('./utils/db-utilites');

// *****Global variables*****
const PORT = process.env.PORT || 3001;


// Functions for db interaction
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
        case 'employees':
            val = await getEmployees();
        default:
            break;
    }
    return val[0];
}
const viewChoices = async (type) => {
    let val = '';
    switch (type) {
        case 'employees':
            val = await viewTable(type);
            break;
        case 'departments':
            val = await viewTable(type);
            break;
        case 'roles':
            val = await viewTable(type);
            break;
        default:
            break;
    }
    let table = cTable.getTable(val[0]);
    console.info('\n' + table);
    return;
}
const setChoices = async (type, answers) => {
    let val = '';
    switch (type) {
        case 'department':
            val = await addDepartment(answers.departmentName);
            break;
        case 'role':
            val = await addRole(answers.roleTitle, answers.roleSalary, answers.roleDepartment);
            break;
        case 'employee':
            val = await addEmployee(answers.employeeFirstName, answers.employeeLastName, answers.employeeTitle, answers.employeeManager);
            break;
        default:
            break;
    }
}
const updateEmployeeRole = async (answers) => {
    let val = '';
    val = await employeeRoleUpdate(answers.eUpdateName, answers.eUpdateRole);
    return;
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
        choices: function(choices) {
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
        choices: function(choices) {
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
        choices: function(choices) {
            choices = getChoices('managers');
            return choices;
        },
        when: function(answer) {
            return (answer.employeeManaged);
        }
    },
    {
        type: 'list',
        message: 'Select the employee to update:',
        name: 'eUpdateName',
        choices: function(choices) {
            choices = getChoices('employees');
            return choices;
        },
        when: function(answer) {
            return (answer.menuSelect === 'updateRole');
        }
    },
    {
        type: 'list',
        message: "Select the employee's new Role:",
        name: 'eUpdateRole',
        choices: function(choices) {
            choices = getChoices('roles');
            return choices;
        },
        when: function(answer) {
            return (answer.menuSelect === 'updateRole');
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
                await viewChoices('employees');
                //console.info(table);
                break;
            case 'addEmployee':
                await setChoices('employee', answer);
                break;
            case 'updateRole':
                await updateEmployeeRole(answer);
                break;
            case 'viewRoles':
                await viewChoices('roles');
                break;
            case 'addRole':
                await setChoices('role', answer);
                break;
            case 'viewDepartments':
                await viewChoices('departments');
                break;
            case 'addDepartment':
                await setChoices('department', answer);
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