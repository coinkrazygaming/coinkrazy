<?php
require_once '../includes/auth.php';
require_once '../config/database.php';

$auth = new Auth();
if (!$auth->isLoggedIn()) {
    header('Location: /login.php');
    exit;
}

$user = $auth->getCurrentUser();

// Coin packages
$packages = [
    [
        'id' => 1,
        'name' => 'Starter Pack',
        'gold_coins' => 10000,
        'bonus_sweeps' => 5,
        'price' => 4.99,
        'popular' => false
    ],
    [
        'id' => 2,
        'name' => 'Player Pack',
        'gold_coins' => 25000,
        'bonus_sweeps' => 15,
        'price' => 9.99,
        'popular' => true
    ],
    [
        'id' => 3,
        'name' => 'High Roller',
        'gold_coins' => 50000,
        'bonus_sweeps' => 35,
        'price' => 19.99,
        'popular' => false
    ],
    [
        'id' => 4,
        'name' => 'VIP Pack',
        'gold_coins' => 100000,
        'bonus_sweeps' => 75,
        'price' => 39.99,
        'popular' => false
    ]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coin Store - CoinKrazy.com</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css" rel="stylesheet">
    <script src="https://www.paypal.com/sdk/js?client-id=<?php echo PAYPAL_CLIENT_ID; ?>&currency=USD"></script>
</head>
<body>
    <?php include '../includes/nav.php'; ?>
    
    <div class="coinstore-container">
        <div class="coinstore-header">
            <h1><i class="fas fa-shopping-cart"></i> Coin Store</h1>
            <p>Purchase Gold Coins and receive bonus Sweeps Coins!</p>
            <div class="currency-reminder">
                <div class="currency-note">
                    <i class="fas fa-info-circle"></i>
                    <strong>Remember:</strong> Gold Coins have no cash value. Sweeps Coins cannot be purchased directly - they are awarded as bonuses only!
                </div>
            </div>
        </div>
        
        <div class="packages-grid">
            <?php foreach ($packages as $package): ?>
                <div class="package-card <?php echo $package['popular'] ? 'popular' : ''; ?>">
                    <?php if ($package['popular']): ?>
                        <div class="popular-badge">
                            <i class="fas fa-star"></i> Most Popular
                        </div>
                    <?php endif; ?>
                    
                    <div class="package-header">
                        <h3><?php echo $package['name']; ?></h3>
                        <div class="package-price">$<?php echo number_format($package['price'], 2); ?></div>
                    </div>
                    
                    <div class="package-content">
                        <div class="package-item main-item">
                            <i class="fas fa-coins"></i>
                            <span><?php echo number_format($package['gold_coins']); ?> Gold Coins</span>
                        </div>
                        
                        <div class="package-item bonus-item">
                            <i class="fas fa-gift"></i>
                            <span>+ <?php echo $package['bonus_sweeps']; ?> Bonus Sweeps Coins</span>
                        </div>
                        
                        <div class="package-value">
                            <small>Total Value: $<?php echo number_format($package['price'] + $package['bonus_sweeps'], 2); ?></small>
                        </div>
                    </div>
                    
                    <div class="package-footer">
                        <div class="paypal-button" data-package-id="<?php echo $package['id']; ?>"></div>
                        <div class="googlepay-button" data-package-id="<?php echo $package['id']; ?>">
                            <button class="btn btn-secondary btn-full">
                                <i class="fab fa-google-pay"></i> Google Pay
                            </button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="coinstore-footer">
            <div class="payment-security">
                <h4><i class="fas fa-shield-alt"></i> Secure Payments</h4>
                <p>All transactions are processed securely through PayPal and Google Pay. Your financial information is never stored on our servers.</p>
            </div>
            
            <div class="terms-reminder">
                <p><small>By purchasing, you agree to our <a href="/terms/">Terms of Service</a>. Gold Coins are virtual currency with no cash value. Sweeps Coins are promotional currency that may be redeemed for prizes where legally permitted.</small></p>
            </div>
        </div>
    </div>
    
    <style>
        .coinstore-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .coinstore-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .coinstore-header h1 {
            font-size: 2.5rem;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .coinstore-header p {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        .currency-reminder {
            background: var(--bg-tertiary);
            border-radius: 1rem;
            padding: 1.5rem;
            border-left: 4px solid var(--warning-color);
        }
        
        .currency-note {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-primary);
        }
        
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .package-card {
            background: var(--bg-secondary);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: var(--shadow-md);
            border: 2px solid var(--border-color);
            position: relative;
            transition: all 0.3s ease;
        }
        
        .package-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .package-card.popular {
            border-color: var(--gold-color);
            transform: scale(1.05);
        }
        
        .popular-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gold-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .package-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .package-header h3 {
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .package-price {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .package-content {
            margin-bottom: 2rem;
        }
        
        .package-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
        }
        
        .main-item {
            background: var(--bg-tertiary);
            border: 2px solid var(--gold-color);
        }
        
        .main-item i {
            color: var(--gold-color);
            font-size: 1.2rem;
        }
        
        .bonus-item {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        }
        
        .bonus-item i {
            color: var(--gold-color);
        }
        
        .package-value {
            text-align: center;
            color: var(--success-color);
            font-weight: bold;
        }
        
        .package-footer {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .btn-full {
            width: 100%;
            justify-content: center;
        }
        
        .coinstore-footer {
            background: var(--bg-secondary);
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
        }
        
        .payment-security {
            margin-bottom: 2rem;
        }
        
        .payment-security h4 {
            color: var(--success-color);
            margin-bottom: 1rem;
        }
        
        .terms-reminder {
            border-top: 1px solid var(--border-color);
            padding-top: 1rem;
        }
        
        .terms-reminder a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .terms-reminder a:hover {
            text-decoration: underline;
        }
    </style>
    
    <script>
        // PayPal integration
        document.querySelectorAll('.paypal-button').forEach(button => {
            const packageId = button.dataset.packageId;
            const packageData = <?php echo json_encode($packages); ?>.find(p => p.id == packageId);
            
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: packageData.price.toString()
                            },
                            description: `${packageData.name} - ${packageData.gold_coins.toLocaleString()} GC + ${packageData.bonus_sweeps} SC`
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        // Process the purchase
                        processPurchase(packageId, details);
                    });
                },
                onError: function(err) {
                    console.error('PayPal error:', err);
                    alert('Payment failed. Please try again.');
                }
            }).render(button);
        });
        
        function processPurchase(packageId, paymentDetails) {
            fetch('/api/process-purchase.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_id: packageId,
                    payment_details: paymentDetails
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPurchaseSuccess(data);
                } else {
                    alert('Purchase processing failed. Please contact support.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Purchase processing failed. Please contact support.');
            });
        }
        
        function showPurchaseSuccess(data) {
            const modal = document.createElement('div');
            modal.className = 'purchase-success-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Purchase Successful!</h2>
                    <div class="purchase-details">
                        <div class="detail-item">
                            <i class="fas fa-coins"></i>
                            <span>${data.gold_coins.toLocaleString()} Gold Coins added</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-gift"></i>
                            <span>${data.sweeps_coins} Bonus Sweeps Coins added</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="closePurchaseModal()">
                        Start Playing!
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 100);
        }
        
        function closePurchaseModal() {
            const modal = document.querySelector('.purchase-success-modal');
            if (modal) {
                modal.remove();
                window.location.href = '/dashboard/';
            }
        }
    </script>
    
    <style>
        .purchase-success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .purchase-success-modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--success-color);
            margin-bottom: 1rem;
        }
        
        .modal-content h2 {
            color: var(--text-primary);
            margin-bottom: 2rem;
        }
        
        .purchase-details {
            margin-bottom: 2rem;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .detail-item i {
            color: var(--gold-color);
        }
    </style>
</body>
</html>
