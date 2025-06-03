let currentTab = null
let startTime = null
const timeSpent = {}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await saveCurrentTime()
  await setCurrentTab(activeInfo.tabId)
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    await saveCurrentTime()
    await setCurrentTab(tabId)
  }
})

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await saveCurrentTime()
    currentTab = null
    startTime = null
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId })
    if (tab) {
      await setCurrentTab(tab.id)
    }
  }
})

async function setCurrentTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId)
    if (tab.url && !tab.url.startsWith("chrome://")) {
      currentTab = {
        id: tabId,
        url: tab.url,
        domain: new URL(tab.url).hostname,
      }
      startTime = Date.now()
    }
  } catch (error) {
    console.error("Error setting current tab:", error)
  }
}

async function saveCurrentTime() {
  if (currentTab && startTime) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    if (timeSpent > 0) {
      await updateTimeStats(currentTab.domain, timeSpent)
      await sendToAPI(currentTab.domain, timeSpent)
    }
  }
}

async function updateTimeStats(domain, seconds) {
  const today = new Date().toDateString()
  const category = await getSiteCategory(domain)

  const result = await chrome.storage.local.get(["dailyStats", "siteStats"])

  // Update daily stats
  const dailyStats = result.dailyStats || {}
  if (!dailyStats[today]) {
    dailyStats[today] = { total: 0, productive: 0, unproductive: 0, neutral: 0 }
  }

  dailyStats[today].total += seconds
  dailyStats[today][category] += seconds

  // Update site stats
  const siteStats = result.siteStats || {}
  if (!siteStats[domain]) {
    siteStats[domain] = { time: 0, category }
  }
  siteStats[domain].time += seconds

  await chrome.storage.local.set({ dailyStats, siteStats })
}

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
    "khanacademy.org",
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

async function sendToAPI(domain, timeSpent) {
  try {
    await fetch("http://localhost:3000/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain,
        timeSpent,
        timestamp: new Date().toISOString(),
        category: await getSiteCategory(domain),
      }),
    })
  } catch (error) {
    console.error("Failed to send data to API:", error)
  }
}

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab) {
    await setCurrentTab(tab.id)
  }
})
