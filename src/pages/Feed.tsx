import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, ThumbsUp, MessageSquare, Clock, Search, Filter, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const mockIssues = [
    {
      id: 1,
      title: "Large pothole causing traffic issues on Main Street",
      category: "Roads & Potholes",
      location: "Rajouri Garden, New Delhi",
      status: "In Progress",
      priority: "High",
      upvotes: 127,
      comments: 23,
      timeAgo: "2 hours ago",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    },
    {
      id: 2,
      title: "Overflowing garbage bins near Central Park",
      category: "Garbage & Sanitation",
      location: "Lodhi Gardens, New Delhi",
      status: "Pending",
      priority: "Medium",
      upvotes: 89,
      comments: 15,
      timeAgo: "5 hours ago",
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400",
    },
    {
      id: 3,
      title: "Street lights not working on Park Avenue",
      category: "Street Lights",
      location: "Lajpat Nagar, New Delhi",
      status: "Resolved",
      priority: "High",
      upvotes: 203,
      comments: 42,
      timeAgo: "1 day ago",
      image: "https://images.unsplash.com/photo-1518640462707-7bbeb685a5a2?w=400",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-success text-white";
      case "In Progress":
        return "bg-info text-white";
      case "Pending":
        return "bg-warning text-white";
      default:
        return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-destructive text-destructive";
      case "Medium":
        return "border-warning text-warning";
      case "Low":
        return "border-success text-success";
      default:
        return "border-muted";
    }
  };

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
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/chatbot">AI Assistant</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
            <NotificationBell />
            <ThemeToggle />
            <Button asChild>
              <Link to="/report">Report Issue</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Community Feed</h1>
              <p className="text-muted-foreground">
                See what's happening in your neighborhood
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search issues..." className="pl-9" />
                </div>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              {selectedCategory && (
                <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Filtered by: {selectedCategory}</p>
                </div>
              )}
              <div className="space-y-2">
                {[
                  "Roads & Potholes",
                  "Water Supply",
                  "Garbage & Sanitation",
                  "Street Lights",
                  "Drainage",
                  "Public Safety",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Issues</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-6">
                {mockIssues
                  .filter((issue) => {
                    // Filter by status tab
                    if (activeTab !== "all") {
                      if (activeTab === "pending" && issue.status !== "Pending") return false;
                      if (activeTab === "progress" && issue.status !== "In Progress") return false;
                      if (activeTab === "resolved" && issue.status !== "Resolved") return false;
                    }
                    // Filter by selected category
                    if (selectedCategory && issue.category !== selectedCategory) return false;
                    return true;
                  })
                  .map((issue) => (
                  <Card key={issue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      {issue.image && (
                        <div className="md:w-1/3">
                          <img
                            src={issue.image}
                            alt={issue.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                                {issue.priority} Priority
                              </Badge>
                              <Badge className={getStatusColor(issue.status)}>
                                {issue.status}
                              </Badge>
                            </div>
                            <Link to={`/issue/${issue.id}`}>
                              <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                                {issue.title}
                              </h3>
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {issue.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {issue.timeAgo}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            {issue.upvotes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {issue.comments}
                          </Button>
                          <Button variant="outline" size="sm" className="ml-auto">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Feed;
