const mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
  con.query("CREATE DATABASE employee_tracker", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });  

con.changeUser({database: 'employee_tracker'},(err) => {
    if (err) throw err;
    console.log("connected to database");
});

var sql = "CREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});
const departments = [ //left off here

]
var sql = "CREATE TABLE Roles (id INT PRIMARY KEY, job_title VARCHAR(50), department_id INT, salary INT, FOREIGN KEY (department_id) REFERENCES Department(id))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});

var sql = "CREATE TABLE Employees (id INT PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), role_id INT, manager_id INT, FOREIGN KEY (role_id) REFERENCES Roles(id),FOREIGN KEY (manager_id) REFERENCES Employees(id))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});

con.end();