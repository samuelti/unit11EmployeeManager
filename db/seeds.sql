USE employee_tracker;

DELETE FROM employees;
DELETE FROM departments;
DELETE FROM roles;

INSERT INTO employees ( first_name, last_name, role_id, manager_id)
VALUES ('Sam', "spinach", 1, NULL),
       ('Vinnie', "spinach", 3, NULL),
       ('John', "Apple", 1, 1);
       
INSERT INTO departments(title)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);