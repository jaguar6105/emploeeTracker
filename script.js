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
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add an Employee", "Add a Department", "Add a Role", "Update Employee Role", "View All Roles", "View All Departments", "Exit"],
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
        init();
    });
}

async function viewEmployeeByMan() {
    connection.query("SELECT * FROM employee ORDER BY manager_id", function (err, res) {
        if (err) throw err;
        console.log(res);
        init();

    });
}

async function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log(res);
        init();

    });
}

async function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.log(res);
        init();

    });
}

async function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log(res);
        init();

    });
}

async function addRole() {
    try {
        connection.query("SELECT * FROM department", async function (err, res) {
            if (err) { throw err; }
            let departList = [];
            for (let i = 0; i < res.length; i++) {
                departList.push(` ${res[i].id} ${res[i].department}`);
            }

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
                type: "list",
                choices: departList,
                message: "Enter department id:"
            });
            let departId = JSON.stringify(department).split(" ");
            connection.query(`INSERT INTO roles (title, salary, department_id) VALUE ('${title}',${salary},${departId[1]});`,
                function (err, res) {
                    if (err) throw err;
                    console.log(`Row added`);
                    init();

                });
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
                if (err) throw err;
                console.log(`${answer} added`);
                init();

            });

    }
    catch (err) {
        console.log(err);
    }

}

async function addEmployee() {
    try {
        connection.query("SELECT * FROM roles", async function (err, res) {
            if (err) { throw err; }
            let roleList = [];
            for (let i = 0; i < res.length; i++) {
                roleList.push(` ${res[i].id} ${res[i].title}`);
            }
            await inquirer.prompt([{
                name: "firstName",
                message: "Enter first name:"
            },
            {
                name: "lastName",
                message: "Enter last name:"
            },
            {
                type: "list",
                choices: roleList,
                name: "role",
                message: "Choose a role:"
            }]).then(function (answer) {
                let roleId = JSON.stringify(answer.role).split(" ");
                connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUE ('${answer.firstName}', '${answer.lastName}', ${roleId[1]});`,
                    function (err, res) {
                        if (err) throw err;
                        console.log(`Row added`);
                        init();

                    });
            });
        });

    }
    catch (err) {
        console.log(err);
    }

}


async function updateEmployeeRole() {
    let name;
    let role

    connection.query("SELECT * FROM employee", async function (err, res) {
        if (err) { throw err; }
        let list = [];
        for (let i = 0; i < res.length; i++) {
            list.push(` ${res[i].id} ${res[i].first_name} ${res[i].last_name}`);
        }
        name = await inquirer.prompt({
            type: "list",
            choices: list,
            name: "name",
            message: "Choose a Employee:"
        });
        let id = JSON.stringify(name.name).split(" ");
        connection.query("SELECT * FROM roles", async function (err, res) {
            if (err) { throw err; }
            let roleList = [];
            for (let i = 0; i < res.length; i++) {
                roleList.push(` ${res[i].id} ${res[i].title}`);
            }
            role = await inquirer.prompt({
                type: "list",
                choices: roleList,
                name: "name",
                message: "Choose a New Role:"
            });
            let roleId = JSON.stringify(role.name).split(" ");
            connection.query(`UPDATE employee SET role_id = ${roleId[1]} WHERE id = ${id[1]};`, async function (err, res) {
                if (err) { throw err; }

                console.log("Update");
                init();
            });
        });
    });
}



async function init() {
    let response = "";
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
        case "Update Employee Role":
            updateEmployeeRole()
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
        case "Exit":
            connection.end();
            break;


    }
}

init();
