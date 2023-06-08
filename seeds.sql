INSERT INTO departments (name)
VALUES 
        ("Human Resources"),
        ("Sales"),
        ("Marketing"),
        ("Legal");

INSERT INTO roles (job_title, departments_id, salary)
VALUES
        ("Training Coordinator", 1, 65000),
        ("Employee Relations", 1, 60000),
        ("Account Manager", 2, 130000),
        ("Marketing Coordinator", 3, 80000),
        ("Legal Counsel", 4, 250000),
        ("Paralegal", 4, 65000);

INSERT INTO employees (first_name, last_name, roles_id, manager_id, is_manager)
VALUES 
        ("Maynard", "Keenan", 1, null, true),
        ("Adam", "Jones", 2, 1, false),
        ("Justin", "Chancellor", 2, 1, false),
        ("Danny", "Carey", 3, 1, false),
        ("Jerry", "Garcia", 3, 1, true),
        ("Colonel", "Claypool", 4, 5, false),
        ("Billy", "Strings", 5, 5, false),
        ("Gene", "Ween", 5, 1, true),
        ("Dean", "Ween", 6, 8, false);
