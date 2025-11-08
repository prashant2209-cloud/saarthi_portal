import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Star, TrendingUp, MapPin, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Profile = () => {
  // Mock user data - will be replaced with API
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    joinDate: "January 2024",
    location: "New Delhi, Delhi",
    points: 1250,
    rank: 23,
    badges: [
      { name: "Early Reporter", icon: Star, description: "Filed first issue", earned: true },
      { name: "Community Hero", icon: Award, description: "100+ upvotes received", earned: true },
      { name: "Active Citizen", icon: TrendingUp, description: "10 issues resolved", earned: true },
      { name: "Top Contributor", icon: Trophy, description: "Top 50 in leaderboard", earned: true },
      { name: "Civic Champion", icon: Award, description: "500+ points earned", earned: false },
    ],
    stats: {
      issuesReported: 15,
      issuesResolved: 8,
      upvotesReceived: 156,
      commentsPosted: 34
    },
    recentActivity: [
      {
        id: 1,
        type: "reported",
        title: "Large Pothole on Connaught Place",
        date: "2024-03-15",
        status: "In Progress",
        upvotes: 156
      },
      {
        id: 2,
        type: "commented",
        title: "Broken Streetlight Near Park",
        date: "2024-03-14",
        status: "Resolved",
        upvotes: 45
      },
      {
        id: 3,
        type: "upvoted",
        title: "Water Leakage in Karol Bagh",
        date: "2024-03-13",
        status: "In Progress",
        upvotes: 89
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "bg-success/10 text-success border-success/20";
      case "in progress": return "bg-info/10 text-info border-info/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/report">Report Issue</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {user.joinDate}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">{user.points}</div>
                <p className="text-sm text-muted-foreground">Civic Points</p>
                <Badge variant="secondary" className="mt-2">Rank #{user.rank}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{user.stats.issuesReported}</div>
              <p className="text-sm text-muted-foreground">Issues Reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-success mb-1">{user.stats.issuesResolved}</div>
              <p className="text-sm text-muted-foreground">Issues Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent mb-1">{user.stats.upvotesReceived}</div>
              <p className="text-sm text-muted-foreground">Upvotes Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-info mb-1">{user.stats.commentsPosted}</div>
              <p className="text-sm text-muted-foreground">Comments Posted</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type === "reported" && "Reported"}
                            {activity.type === "commented" && "Commented"}
                            {activity.type === "upvoted" && "Upvoted"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                        </div>
                        <Link to={`/issue/${activity.id}`} className="font-semibold hover:text-primary transition-colors">
                          {activity.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                          <span className="text-sm text-muted-foreground">{activity.upvotes} upvotes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.badges.map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-lg border ${
                          badge.earned ? "bg-primary/5 border-primary/20" : "opacity-50 grayscale"
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          badge.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          {badge.earned && (
                            <Badge variant="secondary" className="mt-2 text-xs">Earned</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
