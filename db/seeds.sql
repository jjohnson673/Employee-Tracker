INSERT INTO department (id, department_name)
VALUES (1, "Account Executives"),
       (2,"Inside Sales"),
       (3, "Engineering"),
       (4,"Sales Development Reps"),
       (5,"Customer Support");

INSERT INTO employee_role (id, title, salary, department_id)
VALUES (1, "Sr. Account Executive", 120000, 1),
       (2, "Account Executive", 90000, 1),
       (3, "Partner Sales Rep.", 75000, 2),
       (4, "Individual Sales Rep", 70000, 2),
       (5, "Sr. Engineer Lead", 100000, 3),
       (6, "Tehcnical Support", 80000, 3),
       (7, "SDR", 50000, 4),
       (8, "Customer Support", 45000, 5);
       
 
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (11, "Archie", "Lopez", 1, NULL),
       (22, "Kendra", "Mullinsky", 2, 11),
       (33, "Jane", "Harris", 2, 11),
       (44, "Cole", "Abernathy", 3, NULL),
       (55, "Edwin", "McDougal", 3, 44),
       (66, "Floyd", "Hogan", 5, NULL),
       (77, "Josefina", "Nguyen", 4, 44),
       (88, "Clara", "Pattine", 6, 66),
       (99, "Dexter", "Ramirez", 7, NULL),
       (73, "Al", "Russell", 7, 99),
       (42, "Anderson", "Martin", 8, 99);
       