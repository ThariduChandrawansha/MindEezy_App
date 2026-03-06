-- Migration for Payment and Revenue Sharing System

-- Update appointments table
ALTER TABLE `appointments` 
ADD COLUMN `payment_status` ENUM('unpaid', 'paid') DEFAULT 'unpaid',
ADD COLUMN `amount` DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN `system_fee` DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN `doctor_earning` DECIMAL(10,2) DEFAULT 0.00;

-- Update professional_details table
ALTER TABLE `professional_details`
ADD COLUMN `session_fee` DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN `bank_account` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `bank_name` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `bank_branch` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `bank_holder_name` VARCHAR(255) DEFAULT NULL;

-- Create withdrawals table
CREATE TABLE `withdrawals` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
