const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Smawmk153",
  database: 'employee_db'
});

function mainMenu() {
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
      else if (data.selection === 'update-employee-role')
        updateEmployeeData(data);
      else process.exit(0);
    });
}

function getEmployeeData(data) {
  var query = '';
  if (data.selection === 'all-employees') {
    query = `SELECT e.id, e.first_name, e.last_name, r.job_title AS role, m.first_name AS manager_first_name, m.last_name AS manager_last_name FROM employees e JOIN roles r ON e.roles_id = r.id LEFT JOIN employees m ON e.manager_id = m.id`
  } else if (data.selection === 'all-roles') {
    query = `SELECT r.id, job_title, d.name AS department_name, salary FROM roles r JOIN departments d ON d.id = r.departments_id`
  } else if (data.selection === 'all-departments') {
    query = `SELECT * FROM departments`;
  }
  db.query(query, (err, employeeData) => {
    console.table(employeeData);
    mainMenu();
  });
};

function addEmployeeData(data) {
  if (data.selection === 'add-employee')
    addNewEmployee();
  else if (data.selection === 'add-role')
    addNewRole();
  else if (data.selection === 'add-department')
    addNewDepartment();
};

async function addNewEmployee() {
  var titles = [];
  var roleData = await db.promise().query(`SELECT id, job_title FROM roles`);
  roleData[0].forEach(element => {
    titles.push(element.job_title); 
  })
  var managers = ['NULL'];
  var managerData = await db.promise().query(`SELECT first_name, last_name, id FROM employees WHERE employees.manager_id IS NULL`);
  managerData[0].forEach(element => {
    console.log(element.first_name);
    var managerName = `${element.first_name} ${element.last_name}`;
    console.log(managerName);
    managers.push({name: managerName, value: element.id});
    // managers.push(element.first_name)
  }); 
  var data = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the employee\'s first name?'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the employee\'s last name?'
      },
      {
        type: 'list',
        name: 'role',
        message: 'What is the employee\'s role?',
        choices: titles
      },
      {
        type: 'list',
        name: 'managers',
        message: 'Who is the employee\'s manager',
        choices: managers
      },
    ])
  var roleId;
  roleData[0].forEach(element => {
    if (element.job_title === data.role)
      roleId = element.id;
  })
  console.log(data);
  await db.promise().query(`INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", "${roleId}", "${data.managers}")`);
  mainMenu();
};

async function addNewRole() {
  var departments = [];
  var departmentData = await db.promise().query(`SELECT id, name FROM departments`);
  departmentData[0].forEach(element => {
    departments.push(element.name);
  })
  var data = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'jobTitle',
        message: 'What is the new role title?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the new role\'s salary?'
      },
      {
        type: 'list',
        name: 'department',
        message: 'What is the new role\'s department?',
        choices: departments
      },
    ])
  var departmentId;
  departmentData[0].forEach(element => {
    if (element.name === data.department)
    departmentId = element.id;
  })
  await db.promise().query(`INSERT INTO roles (job_title, departments_id, salary) VALUES ("${data.jobTitle}", "${departmentId}", "${data.salary}")`);
  mainMenu();
};

async function addNewDepartment() {
 var data = await inquirer
    .prompt([
      {
      type: 'input',
      name: 'newDepartment',
      message: 'What is the new Department\'s name?'
      },
    ])
  await db.promise().query(`INSERT INTO departments (name) VALUES ("${data.newDepartment}")`)
  mainMenu();
};

async function updateEmployeeData(data) {
  var employees = [];
  var employeeData = await db.promise().query(`SELECT id, first_name, last_name, roles_id, manager_id FROM employees`);
  employeeData[0].forEach(element => {
    employees.push(`${element.first_name} ${element.last_name}`);
  })
  var roles = [];
  var roleData = await db.promise().query(`SELECT id, job_title FROM roles`);
  roleData[0].forEach(element => {
    roles.push(element.job_title);
  })
  var data = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to edit?',
        choices: employees
      },
      {
        type: 'list',
        name: 'role',
        message: 'What is the employee\'s new role?',
        choices: roles
      },
    ]);
  var roleId;
  roleData[0].forEach(element => {
    if (element.job_title === data.role)
      roleId = element.id;
  })
  var employeeId = '';
  employeeData[0].forEach(element => {
    if (`${element.first_name} ${element.last_name}` === data.employee)
    employeeId = element.id;
  })
  await db.promise().query(`UPDATE employees SET roles_id = "${roleId}" WHERE id = "${employeeId}"`);
  mainMenu();
};

mainMenu();