<?php
require_once 'includes/auth.php';
require_once 'config/database.php';

$auth = new Auth();
$db = Database::getInstance()->getConnection();

// Get games for display
$stmt = $db->prepare("SELECT * FROM games WHERE is_active = 1 ORDER BY category, name");
$stmt->execute();
$games = $stmt->fetchAll();

// Get stats
$stmt = $db->prepare("SELECT COUNT(*) as total_users FROM users WHERE account_status = 'active'");
$stmt->execute();
$stats = $stmt->fetch();

$current_user = $auth->getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoinKrazy.com - Social Casino Fun!</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-left">
                <a href="/" class="nav-link">Home</a>
                <a href="/casino/" class="nav-link">Social Casino</a>
                <a href="/sportsbook/" class="nav-link">Sportsbook</a>
                <a href="/poker/" class="nav-link">Poker Room</a>
                <a href="/bingo/" class="nav-link">Bingo Hall</a>
                <a href="/mini/" class="nav-link">MINI Games</a>
            </div>
            
            <div class="nav-center">
                <div class="logo-container">
                    <img src="assets/images/logo-3d.png" alt="CoinKrazy" class="logo-3d">
                    <span class="logo-text">CoinKrazy<span class="logo-domain">.com</span></span>
                </div>
            </div>
            
            <div class="nav-right">
                <?php if ($current_user): ?>
                    <div class="balance-display">
                        <span class="gc-balance"><i class="fas fa-coins"></i> <?php echo number_format($current_user['gold_coins'], 0); ?> GC</span>
                        <span class="sc-balance"><i class="fas fa-star"></i> <?php echo number_format($current_user['sweeps_coins'], 2); ?> SC</span>
                    </div>
                    <a href="/dashboard/" class="nav-link">My Gaming Dashboard</a>
                    <a href="/logout.php" class="nav-link">Logout</a>
                <?php else: ?>
                    <a href="/login.php" class="nav-link">Login</a>
                    <a href="/register.php" class="nav-link">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">
                <i class="fas fa-crown"></i> Welcome to CoinKrazy.com! <i class="fas fa-crown"></i>
            </h1>
            <h2 class="hero-subtitle">
                <i class="fas fa-slot-machine"></i> Social Casino Fun! <i class="fas fa-dice"></i>
            </h2>
            <p class="hero-description">
                Play for FREE • Win Real Prizes • Join the Fun! <i class="fas fa-party-horn"></i>
            </p>
            
            <div class="hero-buttons">
                <?php if (!$current_user): ?>
                    <a href="/register.php" class="btn btn-primary btn-large">
                        <i class="fas fa-gift"></i> Claim FREE 10,000 GC + 10 SC
                    </a>
                    <a href="/login.php" class="btn btn-secondary btn-large">
                        <i class="fas fa-crown"></i> Login & Play
                    </a>
                <?php else: ?>
                    <a href="/casino/" class="btn btn-primary btn-large">
                        <i class="fas fa-play"></i> Play Now
                    </a>
                    <a href="/coinstore/" class="btn btn-gold btn-large">
                        <i class="fas fa-shopping-cart"></i> Get Coins
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-number">1,247</div>
                <div class="stat-label">Players Online</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-number">$125,678.45</div>
                <div class="stat-label">Today's Payouts</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-gamepad"></i></div>
                <div class="stat-number">700+</div>
                <div class="stat-label">Games Available</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-headset"></i></div>
                <div class="stat-number">24/7</div>
                <div class="stat-label">Live Support</div>
            </div>
        </div>
    </section>

    <!-- Daily Mini Games Section -->
    <section class="mini-games-section">
        <div class="section-header">
            <h3><i class="fas fa-clock"></i> Daily Mini Games</h3>
            <p>Play once every 24 hours for FREE SC! <i class="fas fa-calendar"></i></p>
            <span class="exclusive-badge">Exclusive to CoinKrazy!</span>
        </div>
        
        <div class="games-grid mini-games">
            <?php foreach ($games as $game): ?>
                <?php if ($game['category'] === 'inhouse'): ?>
                    <div class="game-card mini-game">
                        <div class="game-image">
                            <img src="<?php echo $game['image_url']; ?>" alt="<?php echo $game['name']; ?>">
                            <div class="game-overlay">
                                <button class="play-btn" onclick="playGame(<?php echo $game['id']; ?>)">
                                    <i class="fas fa-play"></i> Play Now
                                </button>
                            </div>
                        </div>
                        <div class="game-info">
                            <h4><?php echo $game['name']; ?></h4>
                            <p>by CoinKrazy</p>
                            <div class="game-stats">
                                <span class="rtp">RTP: <?php echo $game['rtp']; ?>%</span>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Featured Games Section -->
    <section class="featured-games-section">
        <div class="section-header">
            <h3><i class="fas fa-star"></i> Featured Games</h3>
            <div class="game-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="slots">Slots</button>
                <button class="filter-btn" data-filter="table">Table</button>
                <button class="filter-btn" data-filter="arcade">Arcade</button>
                <button class="filter-btn" data-filter="jackpots">Jackpots</button>
                <button class="filter-btn" data-filter="new">New</button>
                <button class="filter-btn" data-filter="hot">Hot</button>
            </div>
        </div>
        
        <div class="games-grid">
            <?php foreach ($games as $game): ?>
                <div class="game-card" data-category="<?php echo $game['category']; ?>">
                    <div class="game-image">
                        <img src="<?php echo $game['image_url']; ?>" alt="<?php echo $game['name']; ?>">
                        <div class="game-overlay">
                            <button class="play-btn" onclick="playGame(<?php echo $game['id']; ?>)">
                                <i class="fas fa-play"></i> Play Now
                            </button>
                        </div>
                    </div>
                    <div class="game-info">
                        <h4><?php echo $game['name']; ?></h4>
                        <p>by <?php echo $game['provider']; ?></p>
                        <div class="game-stats">
                            <span class="rtp">RTP: <?php echo $game['rtp']; ?>%</span>
                            <span class="bet-range"><?php echo $game['min_bet']; ?> - <?php echo $game['max_bet']; ?> GC</span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>CoinKrazy.com</h4>
                <p>The ultimate social casino experience with dual currency gaming!</p>
                <div class="currency-info">
                    <p><strong>Gold Coins (GC):</strong> Virtual currency with no cash value</p>
                    <p><strong>Sweeps Coins (SC):</strong> Promotional currency (1 SC = $1 USD)</p>
                </div>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="/terms/">Terms of Service</a></li>
                    <li><a href="/privacy/">Privacy Policy</a></li>
                    <li><a href="/faq/">FAQ</a></li>
                    <li><a href="/responsible-gaming/">Responsible Gaming</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Support</h4>
                <ul>
                    <li><a href="/contact/">Contact Us</a></li>
                    <li><a href="/help/">Help Center</a></li>
                    <li><a href="/kyc/">KYC Verification</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 CoinKrazy.com. All rights reserved. Play responsibly. 18+</p>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>
