// CoinKrazy.com Main JavaScript
class CoinKrazy {
  constructor() {
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupGameFilters()
    this.updateBalances()
    this.setupNotifications()
  }

  setupEventListeners() {
    // Game filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterGames(e.target.dataset.filter)
      })
    })

    // Play game buttons
    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const gameId = e.target.closest("[onclick]")?.getAttribute("onclick")?.match(/\d+/)?.[0]
        if (gameId) {
          this.playGame(gameId)
        }
      })
    })
  }

  setupGameFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn")
    const gameCards = document.querySelectorAll(".game-card")

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"))
        // Add active class to clicked button
        btn.classList.add("active")

        const filter = btn.dataset.filter

        gameCards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.display = "block"
            card.style.animation = "fadeIn 0.5s ease-in"
          } else {
            card.style.display = "none"
          }
        })
      })
    })
  }

  async playGame(gameId) {
    try {
      // Check if user is logged in
      const response = await fetch("/api/check-auth.php")
      const authData = await response.json()

      if (!authData.authenticated) {
        this.showNotification("Please login to play games!", "warning")
        window.location.href = "/login.php"
        return
      }

      // Launch game
      this.showNotification("Loading game...", "info")

      // Simulate game launch
      setTimeout(() => {
        window.open(`/game.php?id=${gameId}`, "_blank", "width=1200,height=800")
      }, 1000)
    } catch (error) {
      console.error("Error launching game:", error)
      this.showNotification("Error launching game. Please try again.", "error")
    }
  }

  async updateBalances() {
    try {
      const response = await fetch("/api/get-balance.php")
      const data = await response.json()

      if (data.success) {
        const gcElement = document.querySelector(".gc-balance")
        const scElement = document.querySelector(".sc-balance")

        if (gcElement) {
          gcElement.innerHTML = `<i class="fas fa-coins"></i> ${this.formatNumber(data.gold_coins)} GC`
        }

        if (scElement) {
          scElement.innerHTML = `<i class="fas fa-star"></i> ${this.formatNumber(data.sweeps_coins, 2)} SC`
        }
      }
    } catch (error) {
      console.error("Error updating balances:", error)
    }
  }

  formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `

    // Add to page
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100)

    // Auto remove after 5 seconds
    setTimeout(() => this.removeNotification(notification), 5000)

    // Close button functionality
    notification.querySelector(".notification-close").addEventListener("click", () => {
      this.removeNotification(notification)
    })
  }

  removeNotification(notification) {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }

  getNotificationIcon(type) {
    const icons = {
      info: "info-circle",
      success: "check-circle",
      warning: "exclamation-triangle",
      error: "times-circle",
    }
    return icons[type] || "info-circle"
  }

  setupNotifications() {
    // Add notification styles
    const style = document.createElement("style")
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 1rem;
                min-width: 300px;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 10000;
                border-left: 4px solid #2563eb;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-info { border-left-color: #2563eb; }
            .notification-success { border-left-color: #10b981; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-error { border-left-color: #ef4444; }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
                color: #64748b;
            }
            
            .notification-close:hover {
                color: #1e293b;
            }
        `
    document.head.appendChild(style)
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CoinKrazy()
})

// Global functions for backward compatibility
function playGame(gameId) {
  if (window.coinKrazy) {
    window.coinKrazy.playGame(gameId)
  }
}

function filterGames(category) {
  const filterBtn = document.querySelector(`[data-filter="${category}"]`)
  if (filterBtn) {
    filterBtn.click()
  }
}

// Auto-update balances every 30 seconds
setInterval(() => {
  if (window.coinKrazy) {
    window.coinKrazy.updateBalances()
  }
}, 30000)
