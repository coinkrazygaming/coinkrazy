<?php
session_start();
require_once 'config/database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function login($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND account_status = 'active'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_type'] = 'user';
            
            // Update last login
            $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);
            
            return true;
        }
        return false;
    }
    
    public function adminLogin($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_role'] = $admin['role'];
            $_SESSION['user_type'] = 'admin';
            return true;
        }
        return false;
    }
    
    public function register($data) {
        $stmt = $this->db->prepare("INSERT INTO users (username, email, password_hash, first_name, last_name, phone, date_of_birth, gold_coins, sweeps_coins) VALUES (?, ?, ?, ?, ?, ?, ?, 10000.00, 10.00)");
        
        return $stmt->execute([
            $data['username'],
            $data['email'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['first_name'],
            $data['last_name'],
            $data['phone'],
            $data['date_of_birth']
        ]);
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']) || isset($_SESSION['admin_id']);
    }
    
    public function isAdmin() {
        return isset($_SESSION['admin_id']);
    }
    
    public function getCurrentUser() {
        if (isset($_SESSION['user_id'])) {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            return $stmt->fetch();
        }
        return null;
    }
    
    public function logout() {
        session_destroy();
    }
}
?>
