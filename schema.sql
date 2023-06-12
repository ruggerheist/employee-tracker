DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  job_title VARCHAR(30) NOT NULL,
  departments_id INT NULL,
  salary DECIMAL(7,0) NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (departments_id) REFERENCES departments(id)
  ON DELETE SET NULL 
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  roles_id INT NULL,
  manager_id INT NULL,
  is_manager BOOLEAN NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (roles_id) REFERENCES roles(id)
  ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
  ON DELETE SET NULL 
);