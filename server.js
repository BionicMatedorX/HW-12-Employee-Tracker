// first we set our variables 

const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// connect to the db

const db = mysql.createConnection(

  {

    host: "localhost",
    user: "root",
    password: "ItchyAndScratchy",
    database: "employees_db",

  },

  console.log(`Connection was a success, connected to employees_db database.`)
);

// user prompts to be used in inquirer

const userPrompts = () => {

  console.log(`Select from these options\n`);

  return inquirer

    .prompt([

      {
        type: "list",
        name: "choices",
        choices: [

          // choices for the user within database

          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "End"
        ],
      },
    ])

    // once an option is picked, this will pick a function

    .then((userRes) => {

      const { choices } = userRes;

      if (choices === "View all departments") {

        showDepartments();

      } else if (choices === "View all roles") {

        showRoles();

      } else if (choices === "View all employees") {

        showEmployees();

      } else if (choices === "Add a department") {

        addDep();

      } else if (choices === "Add a role") {

        addRole();

      } else if (choices === "Add an employee") {

        addEmp();

      } else if (choices === "Update an employee role") {

        updateEmpRole();

      } else if (choices === "End") {

        db.end();

      }
    });
};

userPrompts();

// this will display the 'department table' data in schema.sql

showDepartments = () => {

  const dbData = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(dbData, (err, res) => {

    if (err) {

      console.log(err);

    }

    console.table(res);
    userPrompts();

  });
};

// this will display the 'roles table' data in schema.sql

showRoles = () => {

  const dbData = `SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department = department.id`;

  db.query(dbData, (err, res) => {

    if (err) {

      console.log(err);

    }

    console.table(res);
    userPrompts();

  });
};

// this will display the 'employee table' data in schema.sql

showEmployees = () => {

  let dbData = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, concat(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee employee LEFT JOIN employee manager ON employee.manager = manager.id INNER JOIN role ON employee.role = role.id INNER JOIN department ON role.department = department.id ORDER BY ID ASC";

  db.query(dbData, (err, res) => {

    if (err) {

      console.log(err);

    }

    console.table(res);
    userPrompts();

  });
};

// this function adds a new department within the database, under 'department table'

addDep = () => {

  inquirer
    .prompt([

      {

        name: "newDep",
        type: "input",
        message: "What is the new department name?",

      },

    ])

    .then((answer) => {

      let dbData = `INSERT INTO department (name) VALUES (?)`;

      db.query(dbData, answer.newDep, (err, res) => {

        if (err) {

          console.log(err);

        }

        showDepartments();

      });
    });
};

// this function adds a new role in the database under 'role table'

addRole = () => {

  const depDb = "SELECT * FROM department";

  db.query(depDb, (err, res) => {

    if (err) {

      console.log(err);

    }

    let depArray = [];

    res.forEach((department) => {
        
      depArray.push(department.name);

    });

    inquirer

      .prompt([

        {

          name: "departmentName",
          type: "list",
          message: "Which department is this new role part of?",

          choices: depArray,

        },
      ])
      .then((answer) => {

        newRoleInfo(answer);

      });

    const newRoleInfo = (depData) => {

      inquirer
        .prompt([

          {

            name: "newRole",
            type: "input",
            message: "What is the name of the new role?",

          },
          {

            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",

          },
        ])

        .then((answer) => {

          let departmentId;

          res.forEach((department) => {

            if (depData.departmentName === department.name) {

              departmentId = department.id;

            }
          });

          let dbData = `INSERT INTO role (title, salary, department) VALUES (?, ?, ?)`;

          let newDataArray = [answer.newRole, answer.salary, departmentId];

          db.query(dbData, newDataArray, (err) => {

            if (err) {

              console.log(err);

            }

            showRoles();

          });
        });
    };
  });
};

const addEmp = () => {

  inquirer

    .prompt([

      {

        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",

      },

      {

        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",

      },
    ])

    .then((answer) => {

      const empName = [answer.firstName, answer.lastName];

      const roleDb = `SELECT role.id, role.title FROM role`;

      db.query(roleDb, (err, data) => {

        if (err) {

          console.log(err);

        }

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer

          .prompt([

            {

              type: "list",
              name: "role",
              message: "What is the new employee's role?",
              choices: roles,

            },
          ])

          .then((roleChoice) => {

            const role = roleChoice.role;

            empName.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {

              if (err) {

                console.log(err);

              }

              const managers = data.map(({ id, first_name, last_name }) => ({

                name: first_name + " " + last_name,
                value: id,

              }));

              inquirer
                .prompt([

                  {

                    type: "list",
                    name: "manager",
                    message: "Who is the new employee's manager?",
                    choices: managers,

                  },
                ])

                .then((managerChoice) => {

                  const manager = managerChoice.manager;

                  empName.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role, manager) VALUES (?, ?, ?, ?)`;

                  db.query(sql, empName, (err) => {

                    if (err) {

                      console.log(err);

                    }

                    showEmployees();

                  });
                });
            });
          });
      });
    });
};


const updateEmpRole = () => {

  let sqlInfoEmp = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role" FROM employee, role, department WHERE department.id = role.department AND role.id = employee.role`;
  db.query(sqlInfoEmp, (err, res) => {

    if (err) {

      console.log(err);

    }

    let namesArray = [];

    res.forEach((employee) => {

      namesArray.push(`${employee.first_name} ${employee.last_name}`);

    });

    let sqlInfoRole = `SELECT role.id, role.title FROM role`;

    db.query(sqlInfoRole, (err, res) => {

      if (err) {

        console.log(err);

      }

      let rolesArray = [];

      res.forEach((role) => {

        rolesArray.push(role.title);

      });

      inquirer
        .prompt([

          {

            name: "chosenEmployee",
            type: "list",
            message: "Which employee needs to have their role updated?",

            choices: namesArray,

          },

          {

            name: "chosenRole",
            type: "list",
            message: "What is his/her new role?",

            choices: rolesArray,

          },

        ])
        .then((answer) => {

          let newRoleId, employeeId;

          res.forEach((role) => {

            if (answer.chosenRole === role.title) {

              newRoleId = role.id;

            }

          });

          res.forEach((employee) => {

            if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                
              employeeId = employee.id;

            }

          });

          let sqls = `UPDATE employee SET employee.role = ? WHERE employee.id = ?`;

          db.query(sqls, [newRoleId, employeeId], (err) => {

            if (err) {

              console.log(err);

            }
            
            showEmployees();

          });
        });
    });
  });
};