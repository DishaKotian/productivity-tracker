// Content script for additional tracking if needed
let isActive = true
let lastActivity = Date.now()

// Track user activity
document.addEventListener("mousemove", updateActivity)
document.addEventListener("keypress", updateActivity)
document.addEventListener("scroll", updateActivity)
document.addEventListener("click", updateActivity)

function updateActivity() {
  lastActivity = Date.now()
  if (!isActive) {
    isActive = true
    chrome.runtime.sendMessage({ type: "USER_ACTIVE" })
  }
}

// Check for inactivity every 30 seconds
setInterval(() => {
  if (Date.now() - lastActivity > 30000 && isActive) {
    isActive = false
    chrome.runtime.sendMessage({ type: "USER_INACTIVE" })
  }
}, 30000)
