-- Milestone 1: Master File Module (updated to match new ERD)
-- Master/lookup tables only — matches ERD_For_Sys_Dev-Page-3.jpg
-- Import this into MySQL (creates/updates hotelbillingdb)

CREATE DATABASE IF NOT EXISTS hotelbillingdb;
USE hotelbillingdb;

-- ============================================
-- 1. ROLE
-- ============================================
DROP TABLE IF EXISTS tblrole;
CREATE TABLE tblrole (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_type VARCHAR(50) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblrole (role_type, is_active) VALUES
('Admin', 1),
('Staff', 1),
('Housekeeping', 1),
('Guest', 1),
('VIP', 1);

-- ============================================
-- 2. GUEST_TYPE
-- ============================================
DROP TABLE IF EXISTS tblguesttype;
CREATE TABLE tblguesttype (
  guest_type_id INT AUTO_INCREMENT PRIMARY KEY,
  guest_type VARCHAR(50) NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblguesttype (guest_type, discount_percentage, is_active) VALUES
('Regular', 0.00, 1),
('Senior Citizen', 20.00, 1),
('PWD', 20.00, 1),
('VIP', 10.00, 1),
('Corporate', 15.00, 1);

-- ============================================
-- 3. ROOM_TYPE
-- ============================================
DROP TABLE IF EXISTS tblroomtype;
CREATE TABLE tblroomtype (
  room_type_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_name VARCHAR(50) NOT NULL,
  room_type_description VARCHAR(255),
  capacity INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblroomtype (room_type_name, room_type_description, capacity, is_active) VALUES
('Standard', 'Basic room with one bed, fan, and shared amenities', 2, 1),
('Deluxe', 'Air-conditioned room with private bath and TV', 2, 1),
('Suite', 'Spacious room with living area, minibar, and premium view', 4, 1),
('Family', 'Large room with two beds, ideal for families', 6, 1),
('Penthouse', 'Top-floor luxury suite with panoramic view', 4, 1);

-- ============================================
-- 4. ROOM_STATUS
-- ============================================
DROP TABLE IF EXISTS tblroomstatus;
CREATE TABLE tblroomstatus (
  room_status_id INT AUTO_INCREMENT PRIMARY KEY,
  room_status VARCHAR(50) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblroomstatus (room_status, is_active) VALUES
('Available', 1),
('Occupied', 1),
('Under Maintenance', 1),
('Reserved', 1),
('Out of Service', 1);

-- ============================================
-- 5. FLOOR
-- ============================================
DROP TABLE IF EXISTS tblfloor;
CREATE TABLE tblfloor (
  floor_id INT AUTO_INCREMENT PRIMARY KEY,
  floor_number INT NOT NULL,
  floor_name VARCHAR(50),
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblfloor (floor_number, floor_name, is_active) VALUES
(1, 'Ground Floor', 1),
(2, 'Second Floor', 1),
(3, 'Third Floor', 1),
(4, 'Fourth Floor', 1),
(5, 'Penthouse Floor', 1);

-- ============================================
-- 6. BOOKING_STATUS
-- ============================================
DROP TABLE IF EXISTS tblbookingstatus;
CREATE TABLE tblbookingstatus (
  booking_status_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_status VARCHAR(50) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblbookingstatus (booking_status, is_active) VALUES
('Pending', 1),
('Confirmed', 1),
('Checked-In', 1),
('Checked-Out', 1),
('Cancelled', 1);

-- ============================================
-- 7. PAYMENT_TYPE
-- ============================================
DROP TABLE IF EXISTS tblpaymenttype;
CREATE TABLE tblpaymenttype (
  payment_type_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_type_name VARCHAR(50) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblpaymenttype (payment_type_name, is_active) VALUES
('Cash', 1),
('GCash', 1),
('Credit Card', 1),
('Debit Card', 1),
('Bank Transfer', 1);

-- ============================================
-- 8. PAYMENT_STATUS
-- ============================================
DROP TABLE IF EXISTS tblpaymentstatus;
CREATE TABLE tblpaymentstatus (
  payment_status_id INT AUTO_INCREMENT PRIMARY KEY,
  status_name VARCHAR(50) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblpaymentstatus (status_name, is_active) VALUES
('Pending', 1),
('Paid', 1),
('Partially Paid', 1),
('Refunded', 1),
('Failed', 1);

-- ============================================
-- 9. CHARGE_CATEGORY
-- ============================================
DROP TABLE IF EXISTS tblchargecategory;
CREATE TABLE tblchargecategory (
  charge_category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  default_price DECIMAL(10,2) NOT NULL,
  is_taxable TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblchargecategory (category_name, default_price, is_taxable, is_active) VALUES
('Minibar', 150.00, 1, 1),
('Laundry', 100.00, 1, 1),
('Room Service', 200.00, 1, 1),
('Spa', 800.00, 1, 1),
('Airport Transfer', 500.00, 0, 1);

-- ============================================
-- 10. SERVICE_TYPE
-- ============================================
DROP TABLE IF EXISTS tblservicetype;
CREATE TABLE tblservicetype (
  service_type_id INT AUTO_INCREMENT PRIMARY KEY,
  service_type VARCHAR(50) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblservicetype (service_type, service_fee, is_active) VALUES
('Housekeeping', 0.00, 1),
('Room Service', 200.00, 1),
('Laundry', 100.00, 1),
('Spa', 800.00, 1),
('Airport Transfer', 500.00, 1);

-- ============================================
-- 11. ROOMS (references Room_Type, Floor, Room_Status)
-- ============================================
DROP TABLE IF EXISTS tblrooms;
CREATE TABLE tblrooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_id INT NOT NULL,
  floor_id INT NOT NULL,
  room_status_id INT NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (room_type_id) REFERENCES tblroomtype(room_type_id),
  FOREIGN KEY (floor_id) REFERENCES tblfloor(floor_id),
  FOREIGN KEY (room_status_id) REFERENCES tblroomstatus(room_status_id)
);

INSERT INTO tblrooms (room_type_id, floor_id, room_status_id, room_number, is_active) VALUES
(1, 1, 1, '101', 1),
(1, 1, 1, '102', 1),
(1, 1, 1, '103', 1),
(2, 2, 1, '201', 1),
(2, 2, 1, '202', 1),
(2, 2, 1, '203', 1),
(3, 3, 1, '301', 1),
(3, 3, 1, '302', 1),
(4, 4, 1, '401', 1),
(4, 4, 1, '402', 1),
(5, 5, 1, '501', 1);
