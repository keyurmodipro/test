-- ============================================================
-- User Profile Manager — Database Schema
-- ============================================================
-- Run this script manually in your MySQL client to set up
-- the database and tables.
--
-- Usage:
--   mysql -u root -p < database/schema.sql
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS user_profile_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE user_profile_manager;

-- ──────────────────────────────────────────────
-- Users table
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100)  NOT NULL,
  last_name   VARCHAR(100)  NOT NULL,
  date_of_birth DATE        NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  country     VARCHAR(50)   NOT NULL,
  city        VARCHAR(100)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT chk_country CHECK (country IN ('US', 'India')),
  CONSTRAINT chk_email   CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
);

-- ──────────────────────────────────────────────
-- Indexes for search performance
-- ──────────────────────────────────────────────
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name  ON users(last_name);
CREATE INDEX idx_users_email      ON users(email);
