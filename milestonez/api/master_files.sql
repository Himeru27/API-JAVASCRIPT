-- Milestone 1: Master File Module schema
-- Import this into MySQL (adds to / creates hotelbillingdb)

CREATE DATABASE IF NOT EXISTS hotelbillingdb;
USE hotelbillingdb;

-- ============================================
-- 1. ROOM_TYPE (master/lookup table)
-- ============================================
DROP TABLE IF EXISTS tblroomtype;
CREATE TABLE tblroomtype (
  room_type_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_name VARCHAR(50) NOT NULL,
  room_description VARCHAR(255),
  room_rate DECIMAL(10,2) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO tblroomtype (room_type_name, room_description, room_rate, is_active) VALUES
('Standard', 'Basic room with one bed, fan, and shared amenities', 1500.00, 1),
('Deluxe', 'Air-conditioned room with private bath and TV', 2500.00, 1),
('Suite', 'Spacious room with living area, minibar, and premium view', 4000.00, 1),
('Family', 'Large room with two beds, ideal for families', 3200.00, 1),
('Penthouse', 'Top-floor luxury suite with panoramic view', 6500.00, 1);

-- ============================================
-- 2. ROOMS (master/lookup table, references Room_Type)
-- ============================================
DROP TABLE IF EXISTS tblrooms;
CREATE TABLE tblrooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL,
  room_type_id INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (room_type_id) REFERENCES tblroomtype(room_type_id)
);

INSERT INTO tblrooms (room_number, room_type_id, is_active) VALUES
('101', 1, 1),
('102', 1, 1),
('103', 1, 1),
('201', 2, 1),
('202', 2, 1),
('203', 2, 1),
('301', 3, 1),
('302', 3, 1),
('401', 4, 1),
('402', 4, 1),
('501', 5, 1);

-- ============================================
-- 3. PAYMENT_TYPE (master/lookup table)
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
