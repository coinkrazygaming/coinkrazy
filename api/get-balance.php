<?php
header('Content-Type: application/json');
require_once '../includes/auth.php';

$auth = new Auth();

if (!$auth->isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user = $auth->getCurrentUser();

echo json_encode([
    'success' => true,
    'gold_coins' => floatval($user['gold_coins']),
    'sweeps_coins' => floatval($user['sweeps_coins'])
]);
?>
