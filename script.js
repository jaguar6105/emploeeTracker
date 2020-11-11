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
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add an Employee", "Add a Department", "Add a Role", "Remove an Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "View All Departments", "Exit"],
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
        console.log(res);
    });
}

async function viewEmployeeByMan() {
    connection.query("SELECT * FROM employee ORDER BY manager_id", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}

async function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}

async function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}

async function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}

async function addRole() {
    try {
        const { title } = await inquirer.prompt({
            name: "title",
            message: "Enter a title:"
        });
        const { salary } = await inquirer.prompt({
            name: "salary",
            message: "Enter a salary:"
        });
        const { department } = await inquirer.prompt({
            name: "department",
            message: "Enter department id:"
        });

        connection.query(`INSERT INTO roles (title, salary, department_id) VALUE ('${title}',${salary},${department});`,
        function (err, res) {
            if(err) throw err;
            console.log(`Row added`);
        });

    }
    catch (err) {
        console.log(err);
    }

}

async function addDepartments() {

    try {
        const { answer } = await inquirer.prompt({
            name: "answer",
            message: "Enter Department Name:"
        });

        connection.query(`INSERT INTO department (department) VALUES ('${answer}');`, 
        function (err, res) {
            if(err) throw err;
            console.log(`${answer} added`);
        });

    }
    catch (err) {
        console.log(err);
    }

}

async function addEmployee() {
    try {
        const { firstName } = await inquirer.prompt({
            name: "firstName",
            message: "Enter first name:"
        });
        const { lastName } = await inquirer.prompt({
            name: "lastName",
            message: "Enter last name:"
        });
        const { role } = await inquirer.prompt({
            name: "role",
            message: "Enter role id:"
        });

        connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUE ('${firstName}', '${lastName}', ${role});`,
        function (err, res) {
            if(err) throw err;
            console.log(`Row added`);
        });

    }
    catch (err) {
        console.log(err);
    }

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
                await addEmployee();
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
                await viewDepartments();
                break;
            case "Add a Role":
                await addRole();
                break;
            case "Add a Department":
                await addDepartments();
                break;
        }
    }
    connection.end();
}

init();
