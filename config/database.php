<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'coinkrazy_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Site configuration
define('SITE_NAME', 'CoinKrazy.com');
define('SITE_URL', 'https://coinkrazy.com');
define('ADMIN_EMAIL', 'coinkrazy00@gmail.com');

// Currency settings
define('GC_SYMBOL', 'GC');
define('SC_SYMBOL', 'SC');
define('SC_TO_USD_RATE', 1.00);

// Security settings
define('JWT_SECRET', 'your-jwt-secret-key-here');
define('ENCRYPTION_KEY', 'your-encryption-key-here');

// Payment settings
define('PAYPAL_CLIENT_ID', 'your-paypal-client-id');
define('PAYPAL_CLIENT_SECRET', 'your-paypal-client-secret');
define('PAYPAL_SANDBOX', true);

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}
?>
