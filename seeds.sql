INSERT INTO departments (name)
VALUES 
        ("Management"),
        ("Human Resources"),
        ("Sales"),
        ("Marketing"),
        ("Legal");

INSERT INTO roles (job_title, departments_id, salary)
VALUES
        ("Manager", 1, 95000),
        ("Training Coordinator", 2, 65000),
        ("Employee Relations", 2, 60000),
        ("Account Manager", 3, 130000),
        ("Marketing Coordinator", 4, 80000),
        ("Legal Counsel", 5, 250000),
        ("Paralegal", 5, 65000);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES 
        ("Maynard", "Keenan", 2, null),
        ("Adam", "Jones", 3, 1),
        ("Justin", "Chancellor", 3, null),
        ("Danny", "Carey", 4, null),
        ("Jerry", "Garcia", 4, 1),
        ("Colonel", "Claypool", 5, 1),
        ("Billy", "Strings", 6, 1),
        ("Gene", "Ween", 6, null),
        ("Dean", "Ween", 7, null);
