-- Login Module: tbl_users
USE hotelbillingdb;

DROP TABLE IF EXISTS tbl_users;
CREATE TABLE tbl_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

-- No sample account is inserted here because passwords must be hashed with
-- PHP's password_hash(), which this SQL file cannot compute on its own.
-- Use register.html once to create your first admin account
-- (e.g. username: admin / password: admin123), then log in from login.html.
