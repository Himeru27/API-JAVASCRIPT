-- Login Module: tblrole + tbl_users
USE hotelbillingdb;

-- ============================================
-- ROLE (master/lookup table)
-- ============================================
DROP TABLE IF EXISTS tblrole;
CREATE TABLE tblrole (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_type VARCHAR(50) NOT NULL
);

INSERT INTO tblrole (role_type) VALUES
('Admin'),
('User');

-- ============================================
-- USER
-- ============================================
DROP TABLE IF EXISTS tbl_users;
CREATE TABLE tbl_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  user_status VARCHAR(20) NOT NULL DEFAULT 'Active',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES tblrole(role_id)
);

-- No sample account is inserted here because passwords must be hashed with
-- PHP's password_hash(), which this SQL file cannot compute on its own.
-- Use login.html's Register form once to create your first account
-- (e.g. username: admin / password: admin123). New registrations default
-- to the "User" role; promote one to "Admin" from the Manage Users screen
-- (or directly in the database) to access the admin dashboard.
