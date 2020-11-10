const inquirer = require("inquirer");
const sql = require("mysql");


const connection = sql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "employeeManagerDb"
});

//initial question
async function mainMenu() {
    try {
        const { answer } = await inquirer.prompt({
            type: "list",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add an Employee", "Remove an Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "View All Departments", "Exit"],
            name: "answer",
            message: "What do would you like to do:"
        });
        return answer;

    } catch (err) {
        console.log(err);
    }
}

async function viewEmployeeByDep() {


    connection.query("SELECT * FROM employee ORDER BY role_id", function (err, res) {
        if (err) throw err;
        console.log("TEST");
        console.log(res);
    });
}

async function viewEmployeeByMan() {


    connection.query("SELECT * FROM employee ORDER BY manager_id", function (err, res) {
        if (err) throw err;
        console.log("TEST");
        console.log(res);
    });
}

async function viewEmployee() {


    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log("TEST");
        console.log(res);
    });
}

async function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.log("TEST");
        console.log(res);
    });
}

async function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log("TEST");
        console.log(res);
    });
}


async function init() {
    var response = "";
    while (response != "Exit") {
        response = await mainMenu();
        switch (response) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View All Employees By Department":
                viewEmployeeByDep();
                break;
            case "View All Employees By Manager":
                viewEmployeeByMan();
                break;
            case "Add an Employee":
                //viewEmployee();
                break;
            case "Remove an Employee":
                //viewEmployeeByDep();
                break;
            case "Update Employee Role":
                //viewEmployeeByMan();
                break;
            case "Update Employee Manager":
                //viewEmployee();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "View All Departments":
                viewDepartments();
                break;
        }
    }
    connection.end();
}

init();
