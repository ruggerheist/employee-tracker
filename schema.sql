DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  job_title VARCHAR(30) NOT NULL,
  departments_id INT NOT NULL,
  salary DECIMAL(7,0) NOT NULL,
  PRIMARY KEY (id) NOT NULL,
  FOREIGN KEY (departments_id) REFERENCES departments(id)  
);

CREATE TABLE employees (
  id INT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  roles_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roles_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);