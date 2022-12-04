

const msql = require('mysql');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

const employeeconnect = require(__dirname + '/db/employeeconnect.js')


//CONNECTIONS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeTracker_db'
});

//Start: What would you like to do....? //
function start() {
    inquirer
        .prompt ([
            {
                type: 'list',
                name: 'startHome',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Departments',
                    'View All Employee Roles',
                    'Add New Department',
                    'Add New Employee',
                    'Add New Employee Role',
                    'Change Current Employee',
                    'Delete Department',
                    'Delete Employee',
                    'Delete Employee Role',
                    'Exit'
                ]

            }
        ])
        .then(answers => {
            switch(answers.startHome) {
                case 'View All Employees' :
                    viewEmployees();
                    break;
                case 'View All Departments' :
                    viewDepartments();
                    break;
                case 'View All Employee Roles' :
                    viewEmployeeRoles();
                    break;
                case 'Add New Department' :
                    addDepartment();
                    break;
                case 'Add New Employee' : 
                    addEmployee();
                    break;
                case 'Add New Employee Role' :
                    addEmployeeRole();
                    break;
                case 'Change Current Employee Role' :
                    changeEmployeeRole();
                    break;
                case 'Delete Department' :
                    deleteDepartment();
                    break;
                case 'Delete Employee' :
                    deleteEmployee();
                    break;
                case 'Delete Employee Role' :
                    deleteEmployeeRole();
                    break;

                
                default:
                    console.log("Exiting Program");
                    process.exit();

            };
        });
};





//-----------//
// ADDITIONS //
//-----------//

//ADD DEPARTMENT

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?',
            default: () => {},
            validate: name => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(name);
                if (valid) {
                    return true;
                } else {
                    return false;
                }
            }

        }
    ]).then((answers) => {
        insertDept(answers.name);
    });
}

function insertDept(newDept) {
    connection.query('INSERT INTO departments SET ?', new Department(newDept), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${newDept} to Departments`);
        init();
    });
}

//ADD ROLE

//ADD EMPLOYEE



//---------//
// UPDATES //
//---------//

//UPDATE EMPLOYEE ROLE

//------//
// VIEW //
//------//

//VIEW ALL ROLES

//VIEW ALL DEPARTMENTS

//VIEW ALL EMPLOYEES


