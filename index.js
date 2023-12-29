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

    .then((data) => {
        switch (data.userInput) {
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
            addRole();
        break;
            case "Add an employee":
            addEmployee();
        break;
            case "Update an employee role":
            updateRole();
        break;
            case "Exit":
            console.log("Goodbye!")
            connection.end()
        break;
            default:
            console.log("Invalid choice! Try again.");
        break;
        }
    });
};





//functions
//view all departments
//view all roles
//view all employees
//add a department
//add a role
//add an employee
//update an employee role