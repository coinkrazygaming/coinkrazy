<?php
header('Content-Type: application/json');
require_once '../includes/auth.php';

$auth = new Auth();

echo json_encode([
    'authenticated' => $auth->isLoggedIn(),
    'user_type' => $_SESSION['user_type'] ?? null
]);
?>
