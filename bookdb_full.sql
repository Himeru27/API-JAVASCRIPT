-- ============================================================
-- FULL DATABASE SQL: bookdb
-- Book Information Management System + Borrow Transaction feature
-- ============================================================

CREATE DATABASE IF NOT EXISTS bookdb;
USE bookdb;

-- ------------------------------------------------------------
-- Existing table: tblcategories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tblcategories (
  cat_id INT AUTO_INCREMENT PRIMARY KEY,
  cat_name VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- Existing table: tblbooks
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tblbooks (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  book_title VARCHAR(255) NOT NULL,
  book_author VARCHAR(255) NOT NULL,
  book_isbn VARCHAR(50) NOT NULL,
  book_category_id INT NOT NULL,
  book_year_published INT,
  book_publisher VARCHAR(255),
  FOREIGN KEY (book_category_id) REFERENCES tblcategories(cat_id)
);

-- ------------------------------------------------------------
-- New table: tblstudents
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tblstudents (
  stud_id INT AUTO_INCREMENT PRIMARY KEY,
  stud_first_name VARCHAR(100) NOT NULL,
  stud_last_name VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- New table: tbl_borrow_header
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_borrow_header (
  hdr_id INT AUTO_INCREMENT PRIMARY KEY,
  hdr_student_id INT NOT NULL,
  hdr_date DATE NOT NULL,
  hdr_user_id INT NOT NULL,
  FOREIGN KEY (hdr_student_id) REFERENCES tblstudents(stud_id)
);

-- ------------------------------------------------------------
-- New table: tbl_borrow_details
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_borrow_details (
  dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  dtl_header_id INT NOT NULL,
  dtl_book_id INT NOT NULL,
  dtl_qty INT NOT NULL,
  FOREIGN KEY (dtl_header_id) REFERENCES tbl_borrow_header(hdr_id),
  FOREIGN KEY (dtl_book_id) REFERENCES tblbooks(book_id)
);

-- ------------------------------------------------------------
-- Sample data: categories (from your existing tblcategories)
-- ------------------------------------------------------------
INSERT INTO tblcategories (cat_name) VALUES
('Fiction'),
('Non-Fiction'),
('Science Fiction'),
('Fantasy'),
('Mystery'),
('Thriller'),
('Romance'),
('Horror'),
('Biography'),
('History'),
('Self-Help');

-- ------------------------------------------------------------
-- Sample data: students (so students-select isn't empty)
-- ------------------------------------------------------------
INSERT INTO tblstudents (stud_first_name, stud_last_name) VALUES
('Juan', 'Dela Cruz'),
('Maria', 'Santos');
