-- CoinKrazy.com Database Schema
CREATE DATABASE IF NOT EXISTS coinkrazy_db;
USE coinkrazy_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    date_of_birth DATE,
    gold_coins DECIMAL(15,2) DEFAULT 0.00,
    sweeps_coins DECIMAL(15,2) DEFAULT 0.00,
    kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    account_status ENUM('active', 'suspended', 'banned') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin/Staff users
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL,
    permissions JSON,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    transaction_type ENUM('deposit', 'withdrawal', 'game_win', 'game_loss', 'bonus', 'purchase') NOT NULL,
    currency_type ENUM('GC', 'SC') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    description TEXT,
    reference_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Games table
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('slots', 'table', 'arcade', 'jackpots', 'inhouse', 'featured', 'new', 'hot') NOT NULL,
    provider VARCHAR(50),
    rtp DECIMAL(5,2) DEFAULT 96.00,
    min_bet DECIMAL(10,2) DEFAULT 1.00,
    max_bet DECIMAL(10,2) DEFAULT 100.00,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions
CREATE TABLE game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_id INT,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    total_bet DECIMAL(15,2) DEFAULT 0.00,
    total_win DECIMAL(15,2) DEFAULT 0.00,
    currency_type ENUM('GC', 'SC') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Daily bonuses
CREATE TABLE daily_bonuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bonus_date DATE,
    gold_coins DECIMAL(10,2) DEFAULT 0.00,
    sweeps_coins DECIMAL(10,2) DEFAULT 0.00,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_daily_bonus (user_id, bonus_date)
);

-- Bingo rooms
CREATE TABLE bingo_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    card_price DECIMAL(10,2) NOT NULL,
    currency_type ENUM('SC') DEFAULT 'SC',
    max_players INT DEFAULT 100,
    current_pot DECIMAL(15,2) DEFAULT 0.00,
    game_status ENUM('waiting', 'active', 'finished') DEFAULT 'waiting',
    next_game_start TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bingo games
CREATE TABLE bingo_games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    game_number INT,
    called_numbers JSON,
    winner_user_id INT NULL,
    pot_amount DECIMAL(15,2),
    game_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_end TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES bingo_rooms(id),
    FOREIGN KEY (winner_user_id) REFERENCES users(id)
);

-- Sports betting
CREATE TABLE sports_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sport_type VARCHAR(50) NOT NULL,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    home_odds DECIMAL(8,2),
    away_odds DECIMAL(8,2),
    draw_odds DECIMAL(8,2),
    status ENUM('upcoming', 'live', 'finished', 'cancelled') DEFAULT 'upcoming',
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sports bets
CREATE TABLE sports_bets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    bet_type ENUM('home', 'away', 'draw') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    odds DECIMAL(8,2) NOT NULL,
    potential_win DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'won', 'lost', 'cancelled') DEFAULT 'pending',
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES sports_events(id)
);

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash, role, permissions) VALUES 
('coinkrazy_admin', 'coinkrazy00@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '{"all": true}');

-- Insert default user for testing
INSERT INTO users (username, email, password_hash, first_name, last_name, gold_coins, sweeps_coins, kyc_status, account_status) VALUES 
('testuser', 'test@coinkrazy.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 10000.00, 10.00, 'approved', 'active');

-- Insert sample games
INSERT INTO games (name, category, provider, rtp, min_bet, max_bet, image_url) VALUES 
('Josey\'s Quack Attack', 'inhouse', 'CoinKrazy', 96.50, 1.00, 50.00, '/assets/images/games/duck-game.jpg'),
('Colin Shots', 'inhouse', 'CoinKrazy', 95.80, 1.00, 25.00, '/assets/images/games/colin-shots.jpg'),
('Beth\'s Darts', 'inhouse', 'CoinKrazy', 97.20, 1.00, 30.00, '/assets/images/games/beths-darts.jpg'),
('Flickin\' My Bean', 'inhouse', 'CoinKrazy', 96.00, 1.00, 40.00, '/assets/images/games/flickin-bean.jpg'),
('Haylie\'s Coins', 'slots', 'CoinKrazy', 96.80, 0.50, 100.00, '/assets/images/games/haylies-coins.jpg');

-- Insert bingo rooms
INSERT INTO bingo_rooms (name, card_price, current_pot) VALUES 
('SC1 Room', 1.00, 0.00),
('SC2 Room', 2.00, 0.00),
('SC5 Room', 5.00, 0.00),
('SC10 Room', 10.00, 0.00);

-- Insert sample sports events
INSERT INTO sports_events (sport_type, home_team, away_team, event_date, home_odds, away_odds, draw_odds) VALUES 
('NFL', 'Kansas City Chiefs', 'Buffalo Bills', '2024-01-15 20:00:00', 1.85, 2.10, 15.00),
('NBA', 'Los Angeles Lakers', 'Boston Celtics', '2024-01-16 21:00:00', 2.20, 1.75, NULL),
('MMA', 'Jon Jones', 'Stipe Miocic', '2024-01-20 22:00:00', 1.45, 2.80, NULL);
