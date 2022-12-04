

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






//-----------//
// ADDITIONS //
//-----------//

//ADD DEPARTMENT

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


