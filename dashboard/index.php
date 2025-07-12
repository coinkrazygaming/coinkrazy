<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
if (!$auth->isLoggedIn()) {
    header('Location: /login.php');
    exit;
}

$user = $auth->getCurrentUser();
$db = Database::getInstance()->getConnection();

// Get recent transactions
$stmt = $db->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
$stmt->execute([$user['id']]);
$transactions = $stmt->fetchAll();

// Get recent games played
$stmt = $db->prepare("
    SELECT gs.*, g.name as game_name, g.category 
    FROM game_sessions gs 
    JOIN games g ON gs.game_id = g.id 
    WHERE gs.user_id = ? 
    ORDER BY gs.session_start DESC 
    LIMIT 5
");
$stmt->execute([$user['id']]);
$recent_games = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gaming Dashboard - CoinKrazy.com</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Include navigation -->
    <?php include '../includes/nav.php'; ?>
    
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1><i class="fas fa-tachometer-alt"></i> Gaming Dashboard</h1>
            <p>Welcome back, <?php echo htmlspecialchars($user['first_name']); ?>!</p>
        </div>
        
        <div class="dashboard-grid">
            <!-- Balance Panel -->
            <div class="dashboard-card balance-card">
                <h3><i class="fas fa-wallet"></i> Your Balance</h3>
                <div class="balance-display-large">
                    <div class="balance-item">
                        <div class="balance-icon gc-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="balance-info">
                            <div class="balance-amount"><?php echo number_format($user['gold_coins'], 0); ?></div>
                            <div class="balance-label">Gold Coins</div>
                            <div class="balance-note">No cash value</div>
                        </div>
                    </div>
                    
                    <div class="balance-item">
                        <div class="balance-icon sc-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="balance-info">
                            <div class="balance-amount"><?php echo number_format($user['sweeps_coins'], 2); ?></div>
                            <div class="balance-label">Sweeps Coins</div>
                            <div class="balance-note">1 SC = $1 USD</div>
                        </div>
                    </div>
                </div>
                
                <div class="balance-actions">
                    <a href="/coinstore/" class="btn btn-gold">
                        <i class="fas fa-shopping-cart"></i> Get Coins
                    </a>
                    <button class="btn btn-primary" onclick="claimDailyBonus()">
                        <i class="fas fa-gift"></i> Daily Bonus
                    </button>
                </div>
            </div>
            
            <!-- Daily Spin Wheel -->
            <div class="dashboard-card spin-card">
                <h3><i class="fas fa-dharmachakra"></i> Daily Spin</h3>
                <div class="spin-wheel-container">
                    <div class="spin-wheel" id="spinWheel">
                        <div class="wheel-section" data-reward="100 GC">100 GC</div>
                        <div class="wheel-section" data-reward="1 SC">1 SC</div>
                        <div class="wheel-section" data-reward="250 GC">250 GC</div>
                        <div class="wheel-section" data-reward="2 SC">2 SC</div>
                        <div class="wheel-section" data-reward="500 GC">500 GC</div>
                        <div class="wheel-section" data-reward="5 SC">5 SC</div>
                    </div>
                    <button class="spin-button" onclick="spinWheel()">
                        <i class="fas fa-play"></i> SPIN
                    </button>
                </div>
                <p class="spin-note">Free spin every 24 hours!</p>
            </div>
            
            <!-- Quick Links -->
            <div class="dashboard-card quick-links-card">
                <h3><i class="fas fa-rocket"></i> Quick Play</h3>
                <div class="quick-links">
                    <a href="/casino/" class="quick-link">
                        <i class="fas fa-slot-machine"></i>
                        <span>Social Casino</span>
                    </a>
                    <a href="/sportsbook/" class="quick-link">
                        <i class="fas fa-football-ball"></i>
                        <span>Sportsbook</span>
                    </a>
                    <a href="/poker/" class="quick-link">
                        <i class="fas fa-spade"></i>
                        <span>Poker Room</span>
                    </a>
                    <a href="/bingo/" class="quick-link">
                        <i class="fas fa-circle"></i>
                        <span>Bingo Hall</span>
                    </a>
                    <a href="/mini/" class="quick-link">
                        <i class="fas fa-gamepad"></i>
                        <span>Mini Games</span>
                    </a>
                </div>
            </div>
            
            <!-- Recent Transactions -->
            <div class="dashboard-card transactions-card">
                <h3><i class="fas fa-history"></i> Recent Transactions</h3>
                <div class="transactions-list">
                    <?php foreach ($transactions as $transaction): ?>
                        <div class="transaction-item">
                            <div class="transaction-icon">
                                <i class="fas fa-<?php echo $this->getTransactionIcon($transaction['transaction_type']); ?>"></i>
                            </div>
                            <div class="transaction-info">
                                <div class="transaction-desc"><?php echo ucfirst(str_replace('_', ' ', $transaction['transaction_type'])); ?></div>
                                <div class="transaction-date"><?php echo date('M j, Y g:i A', strtotime($transaction['created_at'])); ?></div>
                            </div>
                            <div class="transaction-amount <?php echo $transaction['amount'] > 0 ? 'positive' : 'negative'; ?>">
                                <?php echo ($transaction['amount'] > 0 ? '+' : '') . number_format($transaction['amount'], 2); ?> <?php echo $transaction['currency_type']; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <a href="/transactions/" class="btn btn-secondary btn-small">View All</a>
            </div>
            
            <!-- Recent Games -->
            <div class="dashboard-card recent-games-card">
                <h3><i class="fas fa-gamepad"></i> Recently Played</h3>
                <div class="recent-games-list">
                    <?php foreach ($recent_games as $game): ?>
                        <div class="recent-game-item">
                            <div class="game-info">
                                <div class="game-name"><?php echo htmlspecialchars($game['game_name']); ?></div>
                                <div class="game-stats">
                                    Bet: <?php echo number_format($game['total_bet'], 2); ?> <?php echo $game['currency_type']; ?>
                                    | Win: <?php echo number_format($game['total_win'], 2); ?> <?php echo $game['currency_type']; ?>
                                </div>
                                <div class="game-date"><?php echo date('M j, g:i A', strtotime($game['session_start'])); ?></div>
                            </div>
                            <button class="btn btn-primary btn-small" onclick="playGame(<?php echo $game['game_id']; ?>)">
                                Play Again
                            </button>
                        </div>
                    <?php endforeach; ?>
                </div>
                <a href="/games/" class="btn btn-secondary btn-small">Browse All Games</a>
            </div>
            
            <!-- KYC Status -->
            <div class="dashboard-card kyc-card">
                <h3><i class="fas fa-id-card"></i> Account Verification</h3>
                <div class="kyc-status">
                    <div class="kyc-status-indicator <?php echo $user['kyc_status']; ?>">
                        <i class="fas fa-<?php echo $user['kyc_status'] === 'approved' ? 'check-circle' : ($user['kyc_status'] === 'rejected' ? 'times-circle' : 'clock'); ?>"></i>
                        <span><?php echo ucfirst($user['kyc_status']); ?></span>
                    </div>
                    <p class="kyc-description">
                        <?php if ($user['kyc_status'] === 'pending'): ?>
                            Your documents are being reviewed. This usually takes 24-48 hours.
                        <?php elseif ($user['kyc_status'] === 'approved'): ?>
                            Your account is fully verified! You can redeem Sweeps Coins.
                        <?php else: ?>
                            Please resubmit your verification documents.
                        <?php endif; ?>
                    </p>
                </div>
                <?php if ($user['kyc_status'] !== 'approved'): ?>
                    <a href="/kyc/" class="btn btn-primary">
                        <i class="fas fa-upload"></i> Upload Documents
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <style>
        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .dashboard-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .dashboard-header h1 {
            font-size: 2.5rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .dashboard-header p {
            font-size: 1.2rem;
            color: var(--text-secondary);
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .dashboard-card {
            background: var(--bg-secondary);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }
        
        .dashboard-card h3 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .balance-display-large {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .balance-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-tertiary);
            border-radius: 0.75rem;
        }
        
        .balance-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .gc-icon {
            background: var(--gold-color);
            color: white;
        }
        
        .sc-icon {
            background: var(--primary-color);
            color: white;
        }
        
        .balance-amount {
            font-size: 2rem;
            font-weight: bold;
            color: var(--text-primary);
        }
        
        .balance-label {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .balance-note {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        
        .balance-actions {
            display: flex;
            gap: 1rem;
        }
        
        .spin-wheel-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .spin-wheel {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 4px solid var(--primary-color);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: conic-gradient(
                var(--gold-color) 0deg 60deg,
                var(--primary-color) 60deg 120deg,
                var(--success-color) 120deg 180deg,
                var(--warning-color) 180deg 240deg,
                var(--danger-color) 240deg 300deg,
                var(--secondary-color) 300deg 360deg
            );
            transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .wheel-section {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .spin-button {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        }
        
        .spin-button:hover {
            background: var(--secondary-color);
            transform: translate(-50%, -50%) scale(1.1);
        }
        
        .spin-note {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .quick-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
        }
        
        .quick-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--bg-tertiary);
            border-radius: 0.75rem;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        
        .quick-link:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }
        
        .quick-link i {
            font-size: 1.5rem;
        }
        
        .transactions-list, .recent-games-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 1rem;
        }
        
        .transaction-item, .recent-game-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .transaction-item:last-child, .recent-game-item:last-child {
            border-bottom: none;
        }
        
        .transaction-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--bg-tertiary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
        }
        
        .transaction-info, .game-info {
            flex: 1;
        }
        
        .transaction-desc, .game-name {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .transaction-date, .game-date, .game-stats {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        
        .transaction-amount {
            font-weight: bold;
        }
        
        .transaction-amount.positive {
            color: var(--success-color);
        }
        
        .transaction-amount.negative {
            color: var(--danger-color);
        }
        
        .kyc-status-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .kyc-status-indicator.approved {
            color: var(--success-color);
        }
        
        .kyc-status-indicator.pending {
            color: var(--warning-color);
        }
        
        .kyc-status-indicator.rejected {
            color: var(--danger-color);
        }
        
        .kyc-description {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .balance-actions {
                flex-direction: column;
            }
            
            .quick-links {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
    
    <script>
        let canSpin = true;
        let lastSpinTime = localStorage.getItem('lastSpinTime');
        
        function checkSpinAvailability() {
            if (lastSpinTime) {
                const timeDiff = Date.now() - parseInt(lastSpinTime);
                const hoursLeft = 24 - (timeDiff / (1000 * 60 * 60));
                
                if (hoursLeft > 0) {
                    canSpin = false;
                    document.querySelector('.spin-button').innerHTML = `<i class="fas fa-clock"></i> ${Math.ceil(hoursLeft)}h`;
                    document.querySelector('.spin-button').disabled = true;
                }
            }
        }
        
        function spinWheel() {
            if (!canSpin) return;
            
            const wheel = document.getElementById('spinWheel');
            const button = document.querySelector('.spin-button');
            
            // Disable button
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Random rotation (multiple full rotations + random position)
            const randomRotation = 1440 + Math.random() * 360; // 4 full rotations + random
            wheel.style.transform = `rotate(${randomRotation}deg)`;
            
            // Determine reward based on final position
            setTimeout(() => {
                const rewards = ['100 GC', '1 SC', '250 GC', '2 SC', '500 GC', '5 SC'];
                const rewardIndex = Math.floor((randomRotation % 360) / 60);
                const reward = rewards[rewardIndex];
                
                // Show reward notification
                showRewardNotification(reward);
                
                // Update last spin time
                localStorage.setItem('lastSpinTime', Date.now().toString());
                canSpin = false;
                
                // Update button
                button.innerHTML = '<i class="fas fa-check"></i> Claimed';
                
                // Update balances
                updateBalances();
            }, 3000);
        }
        
        function showRewardNotification(reward) {
            const notification = document.createElement('div');
            notification.className = 'reward-notification';
            notification.innerHTML = `
                <div class="reward-content">
                    <i class="fas fa-gift"></i>
                    <h3>Congratulations!</h3>
                    <p>You won ${reward}!</p>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.remove();
            }, 4000);
        }
        
        function claimDailyBonus() {
            fetch('/api/claim-daily-bonus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showRewardNotification(`${data.gold_coins} GC + ${data.sweeps_coins} SC`);
                    updateBalances();
                } else {
                    alert(data.message || 'Unable to claim bonus at this time.');
                }
            })
            .catch(error => {
                console.error('Error claiming bonus:', error);
                alert('Error claiming bonus. Please try again.');
            });
        }
        
        function updateBalances() {
            fetch('/api/get-balance.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelectorAll('.balance-amount').forEach((el, index) => {
                        if (index === 0) {
                            el.textContent = new Intl.NumberFormat().format(data.gold_coins);
                        } else {
                            el.textContent = new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(data.sweeps_coins);
                        }
                    });
                }
            });
        }
        
        // Check spin availability on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkSpinAvailability();
        });
    </script>
    
    <style>
        .reward-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            transition: transform 0.3s ease;
            text-align: center;
            min-width: 300px;
        }
        
        .reward-notification.show {
            transform: translate(-50%, -50%) scale(1);
        }
        
        .reward-content i {
            font-size: 3rem;
            color: var(--gold-color);
            margin-bottom: 1rem;
        }
        
        .reward-content h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .reward-content p {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }
    </style>
</body>
</html>

<?php
// Helper function for transaction icons
function getTransactionIcon($type) {
    $icons = [
        'deposit' => 'plus-circle',
        'withdrawal' => 'minus-circle',
        'game_win' => 'trophy',
        'game_loss' => 'gamepad',
        'bonus' => 'gift',
        'purchase' => 'shopping-cart'
    ];
    return $icons[$type] ?? 'circle';
}
?>
