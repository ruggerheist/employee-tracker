const inquirer = require('inquirer');
const mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: 'employee_db'  
});

//add to menu function{
inquirer
    .prompt([
        
    ])
//}

function viewDepartments() {
    const sql = `SELECT * from departments`;
  
 con.query(sql, (err, dept_info) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table(dept_info);
    // res.json({
    //   message: 'success',
    //   data: dept_info
    // });
  });
};

viewDepartments();

function viewRoles() {
  const sql = `SELECT * from roles`;

  con.query(sql, (err, role_info) => {
    if (err) {
      res.status(500).json({
        error: err.message });
        return;
    }
    console.table(role_info);
  });
};

viewRoles();