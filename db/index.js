const connection = require('./conections');

class DB {
    constructor(connection){
        this.connection=connection
    }

    viewAllEmployees(){
        return this.connection.promise().query(
            "SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role_title, roles.salary, departments.title AS department_title, concat(manager.first_name, ' ', manager.last_name) as Manager  FROM employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id left join employees manager on manager.id = employees.manager_id"
        );
    }

    viewAllManagers(){
        return this.connection.promise().query(
            'SELECT id, first_name, last_name FROM employees '
        );
    }

    viewAllDepartments(){
        return this.connection.promise().query(
            "SELECT departments.id, departments.title FROM departments"
        );
    }

    viewAllRoles(){
        return this.connection.promise().query(
            "SELECT roles.id, roles.title, roles.salary, departments.title as departments_title FROM roles left join departments on departments.id = roles.department_id"
        )
    }

    addNewDepartment(deptName){
        return this.connection.promise().execute(
            'INSERT INTO departments(title) VALUES (?)',[deptName]
        )
    }

    addNewRole(roleName,roleSalary,roleDept){
        return this.connection.promise().execute(
            'INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)',[roleName,roleSalary,roleDept]
        )
    }

    addNewEmployee(firstName,lastName,roleId,managerId){
        return this.connection.promise().execute(
            'INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)',[firstName,lastName,roleId,managerId]
        )
    }

    updateEmployee(employeeId,newRoleId) {
        return this.connection.promise().execute(
            'UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId,employeeId]
        )
    }
}

module.exports = new DB(connection);