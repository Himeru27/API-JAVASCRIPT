-- Run this in phpMyAdmin (bookdb database) to create the tables needed
-- for the Borrow Transaction feature (header/detail pattern, mirrors
-- tbl_invoice_header / tbl_invoice_details from the reference project).

CREATE TABLE tblstudents (
  stud_id INT AUTO_INCREMENT PRIMARY KEY,
  stud_first_name VARCHAR(100) NOT NULL,
  stud_last_name VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_borrow_header (
  hdr_id INT AUTO_INCREMENT PRIMARY KEY,
  hdr_student_id INT NOT NULL,
  hdr_date DATE NOT NULL,
  hdr_user_id INT NOT NULL,
  FOREIGN KEY (hdr_student_id) REFERENCES tblstudents(stud_id)
);

CREATE TABLE tbl_borrow_details (
  dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  dtl_header_id INT NOT NULL,
  dtl_book_id INT NOT NULL,
  dtl_qty INT NOT NULL,
  FOREIGN KEY (dtl_header_id) REFERENCES tbl_borrow_header(hdr_id),
  FOREIGN KEY (dtl_book_id) REFERENCES tblbooks(book_id)
);

-- Optional sample students so students-select isn't empty
INSERT INTO tblstudents (stud_first_name, stud_last_name) VALUES
('Juan', 'Dela Cruz'),
('Maria', 'Santos');