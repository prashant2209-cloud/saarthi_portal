import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Zap
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for analytics
  const issueTrends = [
    { month: "Jan", reported: 45, resolved: 38 },
    { month: "Feb", reported: 52, resolved: 44 },
    { month: "Mar", reported: 48, resolved: 41 },
    { month: "Apr", reported: 61, resolved: 55 },
    { month: "May", reported: 55, resolved: 49 },
    { month: "Jun", reported: 67, resolved: 58 },
  ];

  const categoryData = [
    { name: "Roads & Potholes", value: 35, color: "#8884d8" },
    { name: "Garbage & Sanitation", value: 25, color: "#82ca9d" },
    { name: "Street Lights", value: 20, color: "#ffc658" },
    { name: "Water Supply", value: 12, color: "#ff7300" },
    { name: "Other", value: 8, color: "#00ff00" },
  ];

  const priorityData = [
    { name: "High", value: 15, color: "#ef4444" },
    { name: "Medium", value: 45, color: "#f59e0b" },
    { name: "Low", value: 40, color: "#10b981" },
  ];

  const statusData = [
    { name: "Resolved", value: 68, color: "#10b981" },
    { name: "In Progress", value: 22, color: "#3b82f6" },
    { name: "Pending", value: 10, color: "#f59e0b" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "resolved",
      title: "Streetlight repaired on Park Avenue",
      time: "2 hours ago",
      points: 25
    },
    {
      id: 2,
      type: "reported",
      title: "New pothole reported on Main Street",
      time: "4 hours ago",
      points: 10
    },
    {
      id: 3,
      type: "upvoted",
      title: "Garbage collection issue upvoted",
      time: "6 hours ago",
      points: 5
    },
  ];

  const topContributors = [
    { name: "Rahul Sharma", points: 1250, issues: 15, rank: 1 },
    { name: "Priya Singh", points: 980, issues: 12, rank: 2 },
    { name: "Amit Kumar", points: 875, issues: 11, rank: 3 },
    { name: "Sneha Patel", points: 720, issues: 9, rank: 4 },
    { name: "Vikram Rao", points: 650, issues: 8, rank: 5 },
  ];

  const kpis = [
    {
      title: "Total Issues",
      value: "1,247",
      change: "+12%",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Resolution Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Avg Response Time",
      value: "2.4 days",
      change: "-0.3d",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Active Citizens",
      value: "3,421",
      change: "+8%",
      icon: Users,
      color: "text-purple-600"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            SAARTHI
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/feed">Feed</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/report">Report Issue</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time insights into civic engagement and issue resolution
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <p className="text-3xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {kpi.change} from last month
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Issue Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="status">Status Overview</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Issue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={issueTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="reported"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Resolution Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Resolution Rate</span>
                      <span>94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>High Priority Issues</span>
                      <span>89.5%</span>
                    </div>
                    <Progress value={89.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Time Goal</span>
                      <span>76.3%</span>
                    </div>
                    <Progress value={76.3} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Issues by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Priority Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Issue Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {contributor.rank}
                          </div>
                          <div>
                            <p className="font-semibold">{contributor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contributor.issues} issues reported
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{contributor.points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {activity.type === "resolved" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.type === "reported" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                          {activity.type === "upvoted" && <TrendingUp className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{activity.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                            <Badge variant="secondary" className="text-xs">
                              +{activity.points} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
