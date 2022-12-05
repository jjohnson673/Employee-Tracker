

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
                    viewDepart();
                    break;
                case 'View All Employee Roles' :
                    viewRoles();
                    break;
                case 'Add New Department' :
                    addDepart();
                    break;
                case 'Add New Employee' : 
                    addEmployee();
                    break;
                case 'Add New Employee Role' :
                    addRole();
                    break;
                case 'Change Current Employee Role' :
                    changeRole();
                    break;
                case 'Delete Department' :
                    deleteDepart();
                    break;
                case 'Delete Employee' :
                    deleteEmployee();
                    break;
                case 'Delete Employee Role' :
                    deleteRole();
                    break;

                
                default:
                    console.log("Exiting Program");
                    process.exit();

            };
        });
};

//------//
// VIEW //
//------//

//VIEW ALL ROLES
function viewRoles() {
    connection.query(`SELECT r.title AS 'Role', d.name AS 'Department', r.salary AS 'Salary'
                      FROM roles r
                      JOIN departments d
                      ON r.department_id = d.id
                      ORDER BY r.department_id`, 
                      (err, res) => {
                          if (err) throw err;
                          console.log('\n')
                          console.table(res);
                          init();
                      });
}

//VIEW ALL DEPARTMENTS
function viewDepart() {
    connection.query(`SELECT name AS 'Departments' FROM departments`, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        init();
    });
}
//VIEW ALL EMPLOYEES

function viewEmployees() {
    connection.query(`SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    employee_role.title, 
    department.department_name AS 'department', 
    employee_role.salary
    FROM employee, employee_role, department 
    WHERE department.id = employee_role.department_id 
    AND employee_role.id = employee.role_id
    ORDER BY employee.id ASC`, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        init();
    });
}

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




