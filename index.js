const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Smawmk153",
  database: 'employee_db'
});

figlet(`Employee\nDatabase`, function (err, data){ 
  err ? console.error(err) : console.log(data)  
    mainMenu();
  }
);

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
            value: 'allEmployees'
          },
          {
            name: 'Add Employee',
            value: 'addEmployee'
          },
          {
            name: 'Update Employee Role',
            value: 'updateEmployeeRole'
          },
          {
            name: 'View All Roles',
            value: 'allRoles'
          },
          {
            name: 'Add Role',
            value: 'addRole'
          },
          {
            name: 'View All Departments',
            value: 'allDepartments'
          },
          {
            name: 'Add Department',
            value: 'addDepartment'
          },
          {
            name: 'View Employees by Manager',
            value: 'viewEmployeesByManager'
          },
          {
            name: 'View Employees by Department',
            value: 'viewEmployeesByDepartment'
          },
          {
            name: 'View Department Budget',
            value: 'viewDepartmentBudget'
          },
          {
            name: 'Delete Department, Role, or Employee',
            value: 'delete'
          },
          {
            name: 'Quit',
            value: 'quit'
          },
        ]
      }
    ]).then((data) => {
      if (['allEmployees', 'allRoles', 'allDepartments'].includes(data.selection))
        getEmployeeData(data);
      else if (['addEmployee', 'addRole', 'addDepartment'].includes(data.selection))
        addEmployeeData(data);
      else if (data.selection === 'updateEmployeeRole')
        updateEmployeeData(data);
      else if (data.selection === 'viewEmployeesByManager')
        managedEmployees();
      else if (data.selection === 'viewEmployeesByDepartment')
        employeesByDepartment();
      else if (data.selection === 'viewDepartmentBudget')
        departmentBudgets();
      else if (data.selection === 'delete')
        deletePrompt();
      else process.exit(0);
    });
};

async function fetchAllEmployees() {
  var employees = [];
  var employeeData = await db.promise().query(`SELECT e.id, e.first_name, e.last_name, r.job_title AS role, m.first_name AS manager_first_name, m.last_name AS manager_last_name, e.is_manager FROM employees e JOIN roles r ON e.roles_id = r.id LEFT JOIN employees m ON e.manager_id = m.id`);
  employeeData[0].forEach(element => {
    var employeeName = `${element.first_name} ${element.last_name}`
    employees.push({name: employeeName, id: element.id});
  }); 
  return employees;
};

async function managedEmployees() {
var managers = await db.promise().query (`SELECT first_name, last_name FROM employees WHERE is_manager = true`);
var choices = [];
managers[0].forEach(manager => {choices.push(`${manager.first_name} ${manager.last_name}`)});
var data = await inquirer
    .prompt ([
      {
        type: 'list',
        name: 'selectedManager',
        message: 'Select manager to see managed employees',
        choices: choices
      },
    ]);   
        
    var employees = await fetchAllEmployees();
      var selectedManager = employees.find(employee => employee.name === data.selectedManager);      
      var listOfManagedEmployees = await db.promise().query(`SELECT * FROM employees WHERE manager_id = "${selectedManager.id}"`);
      console.table(listOfManagedEmployees[0]);
    mainMenu();   
};

async function employeesByDepartment() {
  var departments = await db.promise().query (`SELECT id, name FROM departments`);
  var choices = [];
  departments[0].forEach(department => {choices.push(`${department.name}`)});
  var data = await inquirer
      .prompt ([
        {
          type: 'list',
          name: 'selectedDepartment',
          message: 'Select department to see employees',
          choices: choices
        },
      ]); 
      var departmentId;
      departments[0].forEach(department => {if (department.name === data.selectedDepartment)departmentId = department.id});         
      var listOfEmployees = await db.promise().query(`SELECT e.id, e.first_name, e.last_name, r.job_title AS role, m.first_name AS manager_first_name, m.last_name AS manager_last_name, e.is_manager FROM employees e JOIN roles r ON e.roles_id = r.id LEFT JOIN employees m ON e.manager_id = m.id JOIN departments d on r.departments_id = d.id WHERE d.id = "${departmentId}"`);
        console.table(listOfEmployees[0]);
      mainMenu();   
  };

  async function deletePrompt() {
    var table = await inquirer
        .prompt ([
          {
            type: 'list',
            name: 'selectedTable',
            message: 'Select a Category to Delete From',
            choices: ['Departments', 'Roles', 'Employees']
          },
        ]); 
        if (table.selectedTable === 'Departments') {
        var departmentNames = await db.promise().query(`SELECT name FROM departments`);
        var departments = [];
          departmentNames[0].forEach(departmentName => {departments.push(departmentName.name)});
        var department = await inquirer
          .prompt ([
            {
              type: 'list',
              name: 'selectedDepartment',
              message: 'Select a Department to Delete',
              choices: departments
            }
          ])
          await db.promise().query(`DELETE FROM departments WHERE name = "${department.selectedDepartment}"`);
        } else if (table.selectedTable === 'Roles') {
          var roleNames = await db.promise().query(`SELECT job_title FROM roles`);
          var roles = [];
          roleNames[0].forEach(roleName => {roles.push(roleName.job_title)});
          var role = await inquirer
            .prompt ([
              {
                type: 'list',
                name: 'selectedRole',
                message: 'Select a Role to Delete',
                choices: roles
              }
            ])
            await db.promise().query(`DELETE FROM roles WHERE job_title = "${role.selectedRole}"`);
          } else if (table.selectedTable === 'Employees') {
            var employees = await db.promise().query(`SELECT id, first_name, last_name FROM employees`)
            var employeeNames = [];
            employees[0].forEach(employee => {employeeNames.push(`${employee.first_name} ${employee.last_name}`)});
            var selectedEmployee = await inquirer
              .prompt ([
                {
                  type: 'list',
                  name: 'name',
                  message: 'Select an Employee to Delete',
                  choices: employeeNames
                }
              ])
              var employeeId;
              employees[0].forEach(employee => {if (selectedEmployee.name === `${employee.first_name} ${employee.last_name}`) employeeId = employee.id});
              await db.promise().query(`DELETE FROM employees WHERE id = "${employeeId}"`);
            }        
        mainMenu();   
    };

  async function departmentBudgets() {
    var departments = await db.promise().query (`SELECT id, name FROM departments`);
    var choices = [];
    departments[0].forEach(department => {choices.push(`${department.name}`)});
    var data = await inquirer
        .prompt ([
          {
            type: 'list',
            name: 'selectedDepartment',
            message: 'Select department to see the total budget',
            choices: choices
          },
        ]); 
        var departmentId;
        departments[0].forEach(department => {if (department.name === data.selectedDepartment)departmentId = department.id});         
        var departmentBudgets = await db.promise().query(`SELECT SUM(salary) FROM roles WHERE departments_id = "${departmentId}"`);
          console.table(departmentBudgets[0]);
        mainMenu();   
    };

function getEmployeeData(data) {
  var query = '';
  if (data.selection === 'allEmployees') {
    query = `SELECT e.id, e.first_name, e.last_name, r.job_title AS role, m.first_name AS manager_first_name, m.last_name AS manager_last_name, e.is_manager, r.salary FROM employees e JOIN roles r ON e.roles_id = r.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.id ASC`
  } else if (data.selection === 'allRoles') {
    query = `SELECT r.id, job_title, d.name AS department_name, salary FROM roles r JOIN departments d ON d.id = r.departments_id`
  } else if (data.selection === 'allDepartments') {
    query = `SELECT * FROM departments`;
  }
  db.query(query, (err, employeeData) => {
    var tableR = {};
    employeeData.forEach(row => {
      const updatedRow = {...row};
      delete updatedRow.id;
      tableR[row.id] = updatedRow;
    })
    console.table(tableR);
    mainMenu();
  });
};

function addEmployeeData(data) {
  if (data.selection === 'addEmployee')
    addNewEmployee();
  else if (data.selection === 'addRole')
    addNewRole();
  else if (data.selection === 'addDepartment')
    addNewDepartment();
};

async function addNewEmployee() {
  var titles = [];
  var roleData = await db.promise().query(`SELECT id, job_title FROM roles`);
  roleData[0].forEach(element => {
    titles.push(element.job_title); 
  })
  var employees = fetchAllEmployees();
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
        name: 'isManager',
        message: 'Is this employee a manager?',
        choices: ['Yes', 'No']
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Who is the employee\'s manager',
        choices: employees
      },
      
    ])
  var roleId;
  roleData[0].forEach(element => {
    if (element.job_title === data.role)
      roleId = element.id;
  })
  var isManager = false;
  if (data.isManager === 'Yes')
  isManager = true;
  var manager = employees.find(employee => employee.name === data.manager);
  await db.promise().query(`INSERT INTO employees (first_name, last_name, roles_id, manager_id, is_manager) VALUES ("${data.firstName}", "${data.lastName}", "${roleId}", "${manager.id}", ${isManager})`);
  employees.forEach(employee => {
    if (employee.name === data.manager)
    employeeData[0].forEach(e => {
      if (e.id === employee.id && e.is_manager === 0){    
     db.promise().query(`UPDATE employees SET is_manager = true WHERE id = "${e.id}"`)
      }
    })  
  });
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
  });
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

