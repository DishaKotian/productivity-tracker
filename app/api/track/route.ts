import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a proper database
let trackingData: Array<{
  domain: string
  timeSpent: number
  timestamp: string
  category: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, timeSpent, timestamp, category } = body

    // Store the tracking data
    trackingData.push({
      domain,
      timeSpent,
      timestamp,
      category,
    })

    // Keep only last 1000 entries to prevent memory issues
    if (trackingData.length > 1000) {
      trackingData = trackingData.slice(-1000)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking data:", error)
    return NextResponse.json({ error: "Failed to track data" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ data: trackingData })
}
