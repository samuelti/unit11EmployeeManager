const mysql = require('mysql2');
const inquirer = require('inquirer');
require("console.table");

const db = require('./db');
const { connection } = require('./db');

function start() {
    loadquestions();
}

function viewEmployees() {
    db.viewAllEmployees()
        .then(([data]) => {
            console.table(data)
        }).then(() => loadquestions())
}

function viewRoles() {
    db.viewAllRoles()
        .then(([data]) => {
            console.table(data)
        }).then(() => loadquestions())
}

function viewDepartments() {
    db.viewAllDepartments()
    .then(([data])=> {
        console.table(data)
    }).then(()=>loadquestions())
}

function addDepartment() {
    inquirer
        .prompt(
            [
                {
                    name: 'departmentName',
                    message: 'What is the name of the department?'
                }
            ]
        )
        .then((data) => {
            db.addNewDepartment(data.departmentName)
        }).then(() => loadquestions())
}

function addRole() {
    db.viewAllDepartments()
        .then(([data]) => {
            function getTitle(row) {
                return row.title;
            }
            var titles = data.map(getTitle)
            //console.log(titles)

            inquirer
                .prompt(
                    [
                        {
                            name: 'roleName',
                            message: 'What is the name of the new role?'
                        },
                        {
                            name: 'roleSalary',
                            message: 'What is this role\'s salary?'
                        },
                        {
                            type: 'list',
                            name: 'roleDeptName',
                            message: 'Which department does this role belong to?',
                            choices: (titles)
                        }
                    ]
                )
                .then((data) => {
                    db.viewAllDepartments()
                        .then(([dbData]) => {
                            var titleToId = []

                            function addTitleToId(row) {
                                titleToId[row.title] = row.id
                            }
                            dbData.map(addTitleToId)
                            // console.log(titleToId)
                            db.addNewRole(data.roleName, data.roleSalary, titleToId[data.roleDeptName])
                        })

                }).then(() => loadquestions())
        })
}

function addEmployee() {
    var titleToId = []
    var managerToId = []
    db.viewAllRoles()
        .then(([rolesData]) => {
            function getTitle(row) {
                return row.title;
            }
            function addTitleToId(row) {
                titleToId[row.title] = row.id
            }
            var titles = rolesData.map(getTitle)
            rolesData.map(addTitleToId)
            //console.log(titles)
            db.viewAllManagers()
                .then(([employeeData]) => {
                    function getManager(row) {
                        return row.first_name + ' ' + row.last_name;
                    }
                    function addManagerToId(row) {
                        managerToId[row.first_name + ' ' + row.last_name] = row.id
                    }
                    var managers = employeeData.map(getManager)
                    employeeData.map(addManagerToId)



                    inquirer
                        .prompt(
                            [
                                {
                                    name: 'firstName',
                                    message: 'What is the employee\'s first name?'
                                },
                                {
                                    name: 'lastName',
                                    message: 'What is the employee\'s last name?'
                                },
                                {
                                    type: 'list',
                                    name: 'employeeRoles',
                                    message: 'What is this employee\'s role?',
                                    choices: (titles)
                                },
                                {
                                    type: 'list',
                                    name: 'employeeManager',
                                    message: 'Who is this employee\'s manager?',
                                    choices: (managers)
                                }
                            ]
                        )
                        .then((data) => {
                            console.log(data.firstName, data.lastName, titleToId[data.employeeRoles], managerToId[data.employeeManager])
                            console.log(data.employeeManager)
                            console.log(managerToId)
                            db.addNewEmployee(data.firstName, data.lastName, titleToId[data.employeeRoles], managerToId[data.employeeManager])
                        }).then(() => loadquestions())
                })
        })
}

function updateEmployeeRole() {
    var employeeToId = [];
    var rolesToId = [];

    db.viewAllManagers()
        .then(([employeeData]) => {
            function getManager(row) {
                return row.first_name + ' ' + row.last_name;
            }
            function addManagerToId(row) {
                employeeToId[row.first_name + ' ' + row.last_name] = row.id
            }
            var employees = employeeData.map(getManager)
            employeeData.map(addManagerToId)
                db.viewAllRoles()
                .then(([roleData]) => {
                    function getRoles(row) {
                        return row.title;
                    }
                    function addRoleToId(row) {
                        rolesToId[row.title] = row.id
                    }
                    var roles = roleData.map(getRoles)
                    roleData.map(addRoleToId)
                    inquirer
                        .prompt(
                            [
                                {
                                    type: 'list',
                                    name: 'employeeName',
                                    message: 'Which employee\'s role do you want to update?',
                                    choices: (employees)
                                },
                                {
                                    type: 'list',
                                    name: 'newRole',
                                    message: 'Which role do you want to assign to the employee?',
                                    choices: (roles)
                                }
                            ]
                        )
                        .then((data) => {
    
                            db.updateEmployee(employeeToId[data.employeeName],rolesToId[data.newRole])
                
                        }).then(() => loadquestions())
                })
        })
}

function loadquestions() {
    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    name: 'option',
                    message: 'What do you want to do?',
                    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
                }
            ]
        )
        .then((data) => {
            switch (data.option) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                default:
                    process.exit();
            }

        })
}



start();