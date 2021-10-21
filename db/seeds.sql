-- example data
INSERT INTO department (name)
VALUES ("HumanResources"),
       ("GeneralOffice"),
       ("Management"),
       ("Media"),
       ("CustomerService");

-- example data for 'role table'
INSERT INTO role (title, salary, department)
VALUES ("Human Resources Entry Level", 25000, 1),
       ("File Manager", 23000, 1),
       ("Market Manager", 49000, 2),
       ("Social Media Manager", 32000, 2),
       ("General Office Employee", 27000, 3),
       ("Janitor", 55000, 3),
       ("Legal Advisor", 890000, 4),
       ("Groundskeeper", 36000, 5);
