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
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager","Add an Employee","Remove an Employee","Update Employee Role","Update Employee Manager", "View All Roles", "View All Departments","Exit"],
            name: "answer",
            message: "What do would you like to do:"
        });
        return answer;

    } catch (err) {
        console.log(err);
    }
}



async function init() {
    var response = "";
    while (response != "Exit") {
        response = await mainMenu();
    }
    connection.end();
}

init();
