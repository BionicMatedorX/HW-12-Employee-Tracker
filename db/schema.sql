-- Creates database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Uses database created
USE employees_db;

-- Create 'department table' and determines data parameters
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create 'role table' and determines data parameters
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department INT,
  FOREIGN KEY (department)
  REFERENCES department(id)
  ON DELETE SET NULL
);

-- Create 'employee table' and determines data parameters
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role INT,
  FOREIGN KEY (role)
  REFERENCES role(id)
  ON DELETE SET NULL,
  manager INT,
  FOREIGN KEY (manager)
  REFERENCES employee(id)
  ON DELETE SET NULL
);