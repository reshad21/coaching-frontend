// const DashboardView = () => {
//   return <div>OVerview page</div>;
// };

// export default DashboardView;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardView() {
  // Mock data - replace with real data from your API
  const stats = {
    totalStudents: 156,
    activeCoaches: 12,
    monthlyRevenue: 24500,
    sessionsThisMonth: 89,
    completionRate: 87,
    avgSessionRating: 4.8,
  };

  const recentActivities = [
    {
      id: 1,
      type: "session",
      title: "Math Session Completed",
      description: "John Doe completed session with Sarah Wilson",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      description: "$150 payment from Michael Brown",
      time: "4 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      type: "registration",
      title: "New Student Registration",
      description: "Emma Davis joined Physics coaching",
      time: "6 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      type: "session",
      title: "Session Scheduled",
      description: "Chemistry session with Alex Johnson",
      time: "8 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      subject: "Mathematics",
      student: "John Doe",
      coach: "Sarah Wilson",
      time: "10:00 AM",
      duration: "1 hour",
      status: "confirmed",
    },
    {
      id: 2,
      subject: "Physics",
      student: "Emma Davis",
      coach: "Michael Chen",
      time: "2:00 PM",
      duration: "1.5 hours",
      status: "pending",
    },
    {
      id: 3,
      subject: "Chemistry",
      student: "Alex Johnson",
      coach: "Lisa Brown",
      time: "4:00 PM",
      duration: "1 hour",
      status: "confirmed",
    },
  ];

  const topPerformers = [
    {
      name: "Sarah Wilson",
      role: "Math Coach",
      sessions: 24,
      rating: 4.9,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Michael Chen",
      role: "Physics Coach",
      sessions: 21,
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Lisa Brown",
      role: "Chemistry Coach",
      sessions: 19,
      rating: 4.7,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Coaches
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCoaches}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2 new this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sessions This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.sessionsThisMonth}
              </div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Session Completion Rate</span>
                    <span className="font-medium">{stats.completionRate}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Session Completion Rate</span>
                      <span className="font-medium">
                        {stats.completionRate}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Session Rating</span>
                    <span className="font-medium">
                      {stats.avgSessionRating}/5.0
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Session Rating</span>
                      <span className="font-medium">
                        {stats.avgSessionRating}/5.0
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(stats.avgSessionRating / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Student Retention Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Student Retention Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `92%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>
                    Scheduled sessions for today
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Session
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{session.time}</span>
                        </div>
                        <div>
                          <p className="font-medium">{session.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.student} with {session.coach}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            session.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {session.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {session.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Student
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Users className="h-4 w-4" />
                  Manage Coaches
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best coaches this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div
                      key={performer.name}
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={performer.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {performer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {performer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {performer.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {performer.sessions} sessions
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ⭐ {performer.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={activity.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {activity.type === "session" && (
                            <Calendar className="h-4 w-4" />
                          )}
                          {activity.type === "payment" && (
                            <DollarSign className="h-4 w-4" />
                          )}
                          {activity.type === "registration" && (
                            <Users className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
