"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp, TrendingDown, Monitor, Coffee, Zap } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface TimeData {
  domain: string
  time: number
  category: "productive" | "unproductive" | "neutral"
}

interface DailyStats {
  date: string
  total: number
  productive: number
  unproductive: number
  neutral: number
}

export default function Dashboard() {
  const [timeData, setTimeData] = useState<TimeData[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()
      setTimeData(data.siteData || [])
      setDailyStats(data.dailyStats || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalTime = timeData.reduce((sum, item) => sum + item.time, 0)
  const productiveTime = timeData
    .filter((item) => item.category === "productive")
    .reduce((sum, item) => sum + item.time, 0)
  const unproductiveTime = timeData
    .filter((item) => item.category === "unproductive")
    .reduce((sum, item) => sum + item.time, 0)
  const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const pieData = [
    { name: "Productive", value: productiveTime, color: "#10b981" },
    { name: "Unproductive", value: unproductiveTime, color: "#ef4444" },
    { name: "Neutral", value: totalTime - productiveTime - unproductiveTime, color: "#6b7280" },
  ]

  const topSites = timeData.sort((a, b) => b.time - a.time).slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your productivity data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Productivity Dashboard</h1>
          <p className="text-gray-600">Track your time and analyze your productivity patterns</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
              <p className="text-xs text-muted-foreground">Across all websites</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productive Time</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatTime(productiveTime)}</div>
              <p className="text-xs text-muted-foreground">Work-related activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{productivityScore}%</div>
              <Progress value={productivityScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distraction Time</CardTitle>
              <Coffee className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatTime(unproductiveTime)}</div>
              <p className="text-xs text-muted-foreground">Social media & entertainment</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sites">Top Sites</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>How you spent your time today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatTime(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Productivity Trend</CardTitle>
                  <CardDescription>Your productivity over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyStats.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatTime(value)} />
                      <Line type="monotone" dataKey="productive" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="unproductive" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Websites</CardTitle>
                <CardDescription>Sites where you spend the most time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSites.map((site, index) => (
                    <div key={site.domain} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{site.domain}</p>
                          <p className="text-sm text-gray-500">{formatTime(site.time)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          site.category === "productive"
                            ? "default"
                            : site.category === "unproductive"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {site.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Your browsing patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dailyStats.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatTime(value)} />
                    <Bar dataKey="productive" stackId="a" fill="#10b981" />
                    <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
                    <Bar dataKey="unproductive" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Productivity Report</CardTitle>
                <CardDescription>Summary of your productivity this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatTime(productiveTime * 7)}</div>
                    <p className="text-sm text-green-700">Productive Time This Week</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{productivityScore}%</div>
                    <p className="text-sm text-blue-700">Average Productivity Score</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">+12%</div>
                    <p className="text-sm text-purple-700">Improvement vs Last Week</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Insights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>Your productivity has improved by 12% compared to last week</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>You spend most productive time between 9 AM - 11 AM</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span>Social media usage increased by 15 minutes daily</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Export Weekly Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
