import { NextResponse } from "next/server"

// Mock data for demo purposes
// In production, this would query your database
const generateMockData = () => {
  const sites = [
    { domain: "github.com", category: "productive", baseTime: 3600 },
    { domain: "stackoverflow.com", category: "productive", baseTime: 2400 },
    { domain: "youtube.com", category: "unproductive", baseTime: 1800 },
    { domain: "facebook.com", category: "unproductive", baseTime: 1200 },
    { domain: "docs.google.com", category: "productive", baseTime: 2100 },
    { domain: "twitter.com", category: "unproductive", baseTime: 900 },
    { domain: "notion.so", category: "productive", baseTime: 1500 },
    { domain: "reddit.com", category: "unproductive", baseTime: 800 },
    { domain: "figma.com", category: "productive", baseTime: 1800 },
    { domain: "netflix.com", category: "unproductive", baseTime: 600 },
  ]

  const siteData = sites.map((site) => ({
    ...site,
    time: site.baseTime + Math.floor(Math.random() * 1200), // Add some randomness
  }))

  // Generate daily stats for the last 14 days
  const dailyStats = []
  for (let i = 13; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const productive = 2000 + Math.floor(Math.random() * 3000)
    const unproductive = 1000 + Math.floor(Math.random() * 2000)
    const neutral = 500 + Math.floor(Math.random() * 1000)

    dailyStats.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: productive + unproductive + neutral,
      productive,
      unproductive,
      neutral,
    })
  }

  return { siteData, dailyStats }
}

export async function GET() {
  try {
    const data = generateMockData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
