document.addEventListener("DOMContentLoaded", async () => {
  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const domain = new URL(tab.url).hostname

  // Update current site info
  document.getElementById("site-name").textContent = domain

  // Get site category
  const category = await getSiteCategory(domain)
  const categoryElement = document.getElementById("site-category")
  categoryElement.textContent = category.charAt(0).toUpperCase() + category.slice(1)
  categoryElement.className = `site-category ${category}-tag`

  // Load today's stats
  loadTodayStats()

  // Dashboard button
  document.getElementById("dashboard-btn").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" })
  })
})

async function getSiteCategory(domain) {
  const productiveSites = [
    "github.com",
    "stackoverflow.com",
    "developer.mozilla.org",
    "docs.google.com",
    "notion.so",
    "figma.com",
    "codepen.io",
    "leetcode.com",
    "coursera.org",
    "udemy.com",
    "khan academy.org",
  ]

  const unproductiveSites = [
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "tiktok.com",
    "youtube.com",
    "netflix.com",
    "reddit.com",
    "twitch.tv",
  ]

  if (productiveSites.some((site) => domain.includes(site))) {
    return "productive"
  } else if (unproductiveSites.some((site) => domain.includes(site))) {
    return "unproductive"
  }
  return "neutral"
}

async function loadTodayStats() {
  const result = await chrome.storage.local.get(["dailyStats"])
  const today = new Date().toDateString()
  const stats = result.dailyStats?.[today] || { total: 0, productive: 0, unproductive: 0 }

  document.getElementById("total-time").textContent = formatTime(stats.total)
  document.getElementById("productive-time").textContent = formatTime(stats.productive)
  document.getElementById("unproductive-time").textContent = formatTime(stats.unproductive)
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}
