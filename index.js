

const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Employee = require(__dirname + '/db/employeeconnect.js')
const Role = require(__dirname + '/db/employeeconnect.js')
const Department = require(__dirname + '/db/employeeconnect.js')
require('dotenv').config();



const connection = mysql.createConnection(
 {
  host: 'localhost',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}
);




startHome();

//Start: What would you like to do....? //
function startHome() {
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
                    'Update Employee',
                    'Delete Department',
                    'Delete Employee',
                    'Delete Employee Role',
                    'View Budget',
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
                case 'Update Employee' :
                    updateEmployee();
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
                case 'View Budget' :
                    viewBudget();
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
    connection.query(`SELECT r.title AS 'Role', d.department_name AS 'Department', r.salary AS 'Salary'
                      FROM employee_role r
                      JOIN department d
                      ON r.department_id = d.id
                      ORDER BY r.department_id`, 
                      (err, res) => {
                          if (err) throw err;
                          console.log('\n')
                          console.table(res);
                          startHome();
                      });
}

//VIEW ALL DEPARTMENTS
function viewDepart() {
    connection.query(`SELECT department_name AS 'Departments' FROM department`, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res);
        startHome();
    });
}
//VIEW ALL EMPLOYEES AND SORT BY MANAGER, LAST NAME, AND DEPT

function viewEmployees() {
    inquirer.prompt([
        {
            name: 'sortBy',
            type: 'list',
            message: 'How would you like to sort your employees?',
            choices: ['View All', 'Manager', 'Department']
        }
    ]).then((answers) => {
        switch(answers.sortBy) {
            case 'View All':
                viewAllEmployees();
                break;
            case 'Manager':
                sortByManager();
                break;
            case 'Department':
                sortByDepartment();
                break;
        }
    })
}

function viewAllEmployees() {
connection.query(`SELECT e.id AS 'Employee ID', e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Role', r.salary AS 'Salary', d.department_name AS 'Department', e.manager_id AS 'Manager ID'
                  FROM employee e
                  JOIN employee_role r
                  ON e.role_id = r.id
                  LEFT JOIN department d
                  ON r.department_id = d.id
                  `, (err, res) => {
                    if (err) throw err;
                    console.log('\n')
                    console.table(res);
                    startHome();
                  });

}

function sortByManager() {
    connection.query(`SELECT e.last_name AS 'Employee Last Name', e.first_name AS 'Employee First Name', m.last_name AS 'Manager'
                      FROM employee e
                      LEFT JOIN employee m
                      ON e.manager_id = m.id
                      ORDER BY m.last_name, e.last_name`, (err, res) => {
                        if (err) throw err;
                        console.log('\n')
                        console.table(res);
                        startHome();
    });

}

function sortByDepartment() {
    connection.query(`SELECT d.department_name AS 'Department', e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Role'
                      FROM employee e
                      JOIN employee_role r
                      ON e.role_id = r.id
                      LEFT JOIN department d
                      ON r.department_id = d.id
                      ORDER BY d.department_name, e.last_name`, (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        startHome();
    });
}

//-----------//
// ADDITIONS //
//-----------//

//ADD DEPARTMENT

function addDepart() {
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
    connection.query('INSERT INTO department SET ?', new Department(newDept), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${newDept} to Departments`);
        startHome();
    });
}

//ADD ROLE
function addRole() {
    const array = [];
    getDepartAsync()
    .then(data => {
            for (let i=0; i<data.length; i++) {
                array.push(data[i])
            }
        })
    .catch(err => {
        console.log(err);
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the employee's title?",
            default: () => {},
            validate: title => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(title);
                if (valid) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the employee's salary?",
            default: () => {},
                validate: salary => {
                    let valid = /^\d+(\.\d{0,2})?$/.test(salary);
                    if (valid) {
                        return true;
                    } else {
                        return false;
                    }
                }
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does this new role belong to?',
            choices: array
        }
    ]).then(answers => {
        let departId;
        for (let i = 0; i < array.length; i++) {
            if (answers.department === array[i].name) {
                departId = array[i].id;
            }
        }
        insertRole(answers.title, answers.salary, departId);
    })
}

function insertRole(title, salary, department_id) {
    connection.query('INSERT INTO employee_role SET ?', new Role(title, salary, department_id), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${title} to Employee Roles`);
        startHome();
    });

}

//ADD EMPLOYEE
function addEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = ['No Manager'];

    getRolesAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role)
        }

        getEmployeesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                employeesData.push(data[i]);
                employeesNames.push(data[i].last_name)
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            default: () => {},
            validate: firstName => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(firstName);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Your name must be between 1 and 30 characters.`)
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            default: () => {},
            validate: lastName => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(lastName);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Your name must be between 1 and 30 characters.`)
                    return false;
                }
            }

        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: rolesNames
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: employeesNames
        }
    ]).then(answers => {
        let roleId;
        let managerId;

        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }

        for (let i = 0; i < employeesData.length; i++) {
            if (answers.manager === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            } else if (answers.manager === 'No Manager') {
                managerId = null;
            }
        }
        insertEmployee(answers.firstName, answers.lastName, roleId, managerId);
    });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
    connection.query('INSERT INTO employee SET ?', new Employee(firstName, lastName, roleId, managerId), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${firstName} ${lastName} to Employees`);
        startHome();
    });
}




//---------//
// UPDATES //
//---------//

//UPDATE EMPLOYEE ROLE
function updateEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = [];

    getRolesAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role)
        }

        getEmployeesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                employeesData.push(data[i]);
                employeesNames.push(data[i].last_name)
            }
            updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
}


function updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames){
    inquirer.prompt([
        {
            type: 'list', 
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeesNames
        },
        {
            type: 'list',
            name: 'update',
            message: 'What needs to be update for this employee?',
            choices: ['New Role', 'New Manager', 'Cancel']
        }
    ]).then(answers => {
        let employeeId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.employee === employeesData[i].last_name) {
                employeeId = employeesData[i].id;
            }
        }
        if (answers.update === 'New Role') {
            getNewRoleId(employeeId, rolesData, rolesNames)
        } else if (answers.update === 'New Manager') {
            employeesNames.push('No Manager');
            getManagerId(employeeId, employeesData, employeesNames)
        } else {
            startHome();
        }
    })
}


function getNewRoleId(employeeId, rolesData, rolesNames){
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's new role?`,
            choices: rolesNames
        }
    ]).then(answers => {
        let roleId;
        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }
        updateEmployeeRole(employeeId, roleId)
    })
}

function updateEmployeeRole(employeeId, roleId) {
    connection.query(`UPDATE employee SET ? WHERE ?`, [
        {
            role_id: roleId
        },
        {
            id: employeeId
        }
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`Employee's role has successfully been updated`);
        startHome();
    })
}


function getManagerId(employeeId, employeesData, employeesNames) {
    inquirer.prompt([
        {
            type: 'list', 
            name: 'manager',
            message: `Who is the employee's new manager?`,
            choices: employeesNames
        }
    ]).then(answers => {
        let managerId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.manager === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            }
        }
        if (answers.manager === 'No Manager') {
            managerId = null;
        }
        updateEmployeeManager(employeeId, managerId)
    })
}

function updateEmployeeManager(employeeId, managerId) {
    connection.query(`UPDATE employee SET ? WHERE ?`, [
        {
            manager_id: managerId
        },
        {
            id: employeeId
        }
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`Employee's manager has successfully been updated`);
        startHome();
    })
}

//--------//
// DELETE //
//--------//

//DELETE EMPLOYEE
function deleteEmployee() {
    getEmployeesAsync()
    .then(data => {
        const employeesData = [];
        const employeesNames = [];
        for (let i = 0; i < data.length; i++) {
            employeesData.push(data[i]);
            employeesNames.push(data[i].last_name)
        }
        deleteEmployeeQuestions(employeesData, employeesNames)
    })
    .catch(err => {
        console.log(err);
    })
}

function deleteEmployeeQuestions(employeesData, employeesNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which employee would you like to delete?',
            choices: employeesNames
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you would like to delete this employee?'
        }
    ]).then(answers => {
        if (answers.confirm){
            let employeeId;
            for (let i = 0; i < employeesData.length; i++) {
                if (answers.name === employeesData[i].last_name) {
                    employeeId = employeesData[i].id;
                }
            }
            deleteEmployeeFromDb(employeeId, answers.name);
        } else {
            startHome();
        }
    })
}

function deleteEmployeeFromDb(employeeId, name) {
    connection.query(`DELETE FROM employee WHERE ?`, {id: employeeId}, (err, res) => {
        if (err) throw err;
        console.log(` ${name} has successfully been removed from the database.`);
        startHome();
    })
}

//DELETE EMPLOYEE ROLE
function deleteRole() {
    getRolesAsync()
    .then(data => {
        const rolesData = [];
        const rolesNames = [];
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role);
        }
        deleteRoleQuestions(rolesData, rolesNames);
    }).catch(err => {
        console.log(err);
    })
}


function deleteRoleQuestions(rolesData, rolesNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which role would you like to delete?',
            choices: rolesNames
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you would like to delete this role?'
        }
    ]).then(answers => {
        if (answers.confirm) {
            let roleId;
            for (let i = 0; i < rolesData.length; i++) {
                if (answers.name === rolesData[i].role) {
                    roleId = rolesData[i].id;
                }
            }
            deleteRoleFromDb(roleId, answers.name);
        } else {
            startHome();
        }
    })
}

function deleteRoleFromDb(roleId, name) {
    connection.query(`DELETE FROM employee_role WHERE ?`, {id: roleId}, (err, res) => {
        if (err) throw err;
        console.log(` ${name} has been successfully deleted from the database.`);
        startHome();
    })
}



//DELETE DEPARTMENT
function deleteDepart() {
    const departData = [];
    const departNames = [];
    getDepartAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            departData.push(data[i]);
            departNames.push(data[i].name);
        }
        deleteDepartQuestions(departData, departNames);
    }).catch(err => {
        console.log(err);
    })
}

function deleteDepartQuestions(departData, departNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: `Which department would you like to delete?`,
            choices: departNames
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure?'
        }
    ]).then(answers => {
        if (answers.confirm) {
            let departId;
            for (let i = 0; i < departData.length; i++) {
                if (answers.name === departData[i].name) {
                    departId = departData[i].id;
                }
            }
            deleteDepartFromDb(departId, answers.name);
        } else {
            startHome();
        }
    });
}

function deleteDepartFromDb(departId, name) {
    connection.query(`DELETE FROM department WHERE ?`, {id: departId}, (err, res) => {
        if (err) throw err;
        console.log(` ${name} has been successfully deleted from the database.`);
        startHome();
    })
}



//-----------------//
// ASYNC FUNCTIONS //
//-----------------//

function getEmployeesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, last_name FROM employee ORDER BY last_name`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}


function getRolesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, title AS 'role' FROM employee_role ORDER BY role`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}



function getDepartAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM department`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}



//-------------------//
// DEPT BUDGET QUERY //
//------------------//

function viewBudget() {
    connection.query(`SELECT d.department_name AS 'Department', SUM()
                  FROM employee_role r
                  JOIN department d
                  ON r.department_id = d.id
                  `, (err, res) => {
                    if (err) throw err;
                    console.log('\n')
                    console.table(res);
                    startHome();
                  });
  }