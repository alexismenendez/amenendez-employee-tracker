const inquirer = require("inquirer")
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employee_db"
    },
    console.log("connected to the employee_db database.")
);

function fetchEmployees() {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, first_name, last_name FROM employee";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching employees: ", err);
                reject(err);
            } else {
                const employees = results.map(role => ({
                    name: `${role.first_name} ${role.last_name}`,
                    value: role.id
                }));
                resolve(employees);
            }
        });
    });
}

function fetchRoles() {
    fetchEmployees().then(employees => {
        const query = "SELECT id, title FROM role";
        db.query(query, (err, results) => {
          if (err) {
            console.error("Error fetching roles: ", err);
            return;
          }
      
          const roles = results.map(role => ({
            name: role.title,
            value: role.id
          }));
      
          addEmployee(roles, employees);
        });
    })
}

function fetchDepartments() {
    const query = "SELECT id, name FROM department";
    db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching departments: ", err);
          return;
        }
    
        const departments = results.map(department => ({
          name: department.name,
          value: department.id
        }));
    
        addRole(departments);
      });
}

function isValidNumber(value) {
    const numberPattern = /^-?\d+(\.\d+)?$/;
    return numberPattern.test(value) || 'Please enter a valid numerical value.';
}

const mainMenu = async () => {
    inquirer
    .prompt({
        name: "userInput",
        type: "list",
        message: "Welcome to employee_db! What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"
        ]
    })

    .then(answer => {
        switch (answer.userInput) {
            case "View all departments":
            viewDepartments();
        break;
            case "View all roles":
            viewRoles();
        break;
            case "View all employees":
            viewEmployees();
        break;
            case "Add a department":
            addDepartment();
        break;
            case "Add a role":
            fetchDepartments();
        break;
            case "Add an employee":
            fetchRoles();
        break;
            case "Update an employee role":
            updateRole();
        break;
            case "Exit":
            console.log("Goodbye!")
            db.end()
        break;
            default:
            console.log("Invalid choice! Try again.");
        break;
        }
    });
};

function viewDepartments() {
    const query = "SELECT * FROM department";
    db.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
};

function viewRoles() {
    const query = "SELECT * FROM role";
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table (results);
        mainMenu();
    });
};

function viewEmployees() {
    const query = "SELECT * FROM employee";
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table (results);
        mainMenu();
    });
};

function addDepartment() {
    inquirer
    .prompt({
      name: "depName",
      type: "input",
      message: "Enter the department name:",
    })
    .then(answer => {
      const query = "INSERT INTO department (name) VALUES (?)";
      db.query(query, [answer.depName], err => {
        if (err) throw err;
        console.log("Department added successfully!");
        mainMenu();
      });
    });
};

function addRole(departments) {
    inquirer
    .prompt([
    {
      name: "roleName",
      type: "input",
      message: "Enter the role's name:",
    },
    {
        name: "roleSalary",
        type: "input",
        message: "Enter the role's salary",
        validate: isValidNumber
    },
    {
        name: "roleDept",
        type: "list",
        message: "Which department does this role belong to?",
        choices: departments
    }
    ])
    .then(answer => {
        const query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        db.query(query, [answer.roleName, answer.roleSalary, answer.roleDept], err => {
            if (err) throw err;
            console.log("Role added successfully!");
            mainMenu();
        });
    });
};


function addEmployee(roles, employees) {
    inquirer.
    prompt([
    {
        name: "employeeName",
        type: "input",
        message: "Enter employee's first name:"
    },
    {
        name: "employeeLast",
        type: "input",
        message: "Enter employee's last name:"
    },
    {
        name: "employeeRole",
        type: "list",
        message: "What is the employee's role?",
        choices: roles
    },
    {
        name: "employeeManager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: employees
    }

])
    .then(answer => {
        const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        db.query(query, [answer.employeeName, answer.employeeLast, answer.employeeRole, answer.employeeManager], err => {
            if (err) throw err;
        });
        console.log("Employee added successfully!");
        mainMenu();
    });
};

mainMenu();

//update an employee role