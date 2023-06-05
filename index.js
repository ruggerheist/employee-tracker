const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Smawmk153",
  database: 'employee_db'  
});

function mainMenu (){
inquirer
    .prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: [
          {
            name: 'View All Employees',
            value: 'all-employees'
          },
          {
            name: 'Add Employee',
            value: 'add-employee'
          },
          {
            name: 'Update Employee Role',
            value: 'update-employee-role'
          },
          {
            name: 'View All Roles',
            value: 'all-roles'
          },
          {
            name: 'Add Role',
            value: 'add-role'
          },
          {
            name: 'View All Departments',
            value: 'all-departments'
          },
          {
            name: 'Add Department',
            value: 'add-department'
          },
          {
            name: 'Quit',
            value: 'quit'
          },
        ]        
      }
    ]).then((data) => {
      if (['all-employees', 'all-roles', 'all-departments'].includes(data.selection))
      getEmployeeData(data);
      else if (['add-employee', 'add-role', 'add-department'].includes(data.selection))
      addEmployeeData(data);
      else if (data === 'update-employee-role')
      updateEmployeeData(data);
      else process.exit(0);
    });
  }
    
function getEmployeeData(data) {
  var query = '';
  if (data.selection === 'all-employees'){
    query = `SELECT * FROM employees`
  } else if (data.selection === 'all-roles'){
    query = `SELECT * FROM roles`
  } else if (data.selection === 'all-departments'){
    query = `SELECT * FROM departments`;
  }
 db.query(query, (err, employeeData) => {
    
    console.table(employeeData);
    mainMenu();
});
};

function addEmployeeData(data) {
  console.log(data);
  if (data.selection === 'add-employee')
  addNewEmployee();
  else if (data.selection === 'add-role')
  addNewRole();
  else if (data.selection === 'add-department')
  addNewDepartment();
};

function addNewEmployee() {
  var titles = [];
  db.query(`SELECT job_title FROM roles`, (err, data) => {
    console.log(data);
    data.forEach(element => {
      titles.push(element.job_title);
    });
  });  
  console.log(titles);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first-name',
        message: 'What is the employees first name?'    
      },
      {
        type: 'input',
        name: 'last-name',
        message: 'What is the employees last name?'   
      },
      {
        type: 'list',
        name: 'role',
        message: 'What is the employees role?',       
        choices: titles
      },
    ]).then((data) => {
      console.log(data);
      mainMenu();
    });
};

// function addNewRole() {
//   mainMenu();
// };

// function addNewDepartment() {
//   mainMenu();
// };

// function updateEmployeeData(data) {
//   mainMenu();
// };

mainMenu();