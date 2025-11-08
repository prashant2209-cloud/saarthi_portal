import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Calendar, ThumbsUp, MessageSquare, Share2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [upvoted, setUpvoted] = useState(false);

  // Mock data - will be replaced with API call
  const issue = {
    id: id,
    title: "Large Pothole on Connaught Place",
    description: "There's a dangerous pothole near the traffic signal that has been causing accidents. It's approximately 2 feet wide and very deep. Multiple vehicles have been damaged. Urgent repair needed before monsoon season.",
    category: "Roads & Infrastructure",
    location: "Connaught Place, Near Regal Cinema, New Delhi",
    status: "In Progress",
    priority: "High",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    upvotes: 156,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-18",
    reportedBy: {
      name: "Rahul Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      points: 450
    },
    assignedTo: "Road Maintenance Department",
    comments: [
      {
        id: 1,
        user: "Priya Singh",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        message: "I also noticed this. My car tire got damaged last week.",
        timestamp: "2024-03-16"
      },
      {
        id: 2,
        user: "Admin - Road Dept",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        message: "We have received your complaint. Our team will inspect the site within 48 hours.",
        timestamp: "2024-03-17",
        isOfficial: true
      }
    ],
    timeline: [
      { status: "Reported", date: "2024-03-15", description: "Issue reported by citizen" },
      { status: "Acknowledged", date: "2024-03-16", description: "Assigned to Road Maintenance Department" },
      { status: "Under Review", date: "2024-03-17", description: "Site inspection scheduled" },
      { status: "In Progress", date: "2024-03-18", description: "Repair work initiated" }
    ]
  };

  const handleUpvote = () => {
    setUpvoted(!upvoted);
    toast.success(upvoted ? "Upvote removed" : "Issue upvoted!");
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    toast.success("Comment added successfully!");
    setComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{issue.category}</Badge>
                      <Badge variant={getPriorityColor(issue.priority)}>{issue.priority} Priority</Badge>
                    </div>
                    <CardTitle className="text-3xl mb-2">{issue.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {issue.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {issue.location}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>

                {/* Image */}
                <img src={issue.image} alt={issue.title} className="w-full h-80 object-cover rounded-lg" />
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={upvoted ? "default" : "outline"}
                    onClick={handleUpvote}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className={`h-4 w-4 ${upvoted ? "fill-current" : ""}`} />
                    {upvoted ? issue.upvotes + 1 : issue.upvotes}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {issue.comments.length}
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{issue.description}</p>
                </div>

                <Separator />

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Comments ({issue.comments.length})</h3>
                  <div className="space-y-4 mb-6">
                    {issue.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comment.user}</span>
                            {comment.isOfficial && (
                              <Badge variant="secondary" className="text-xs">Official</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleComment}>Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={issue.reportedBy.avatar} />
                    <AvatarFallback>{issue.reportedBy.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{issue.reportedBy.name}</p>
                    <p className="text-xs text-muted-foreground">{issue.reportedBy.points} civic points</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/profile/${issue.reportedBy.name}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{issue.assignedTo}</p>
                <p className="text-xs text-muted-foreground mt-1">Last updated: {issue.updatedAt}</p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resolution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issue.timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          index === issue.timeline.length - 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {index === issue.timeline.length - 1 ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </div>
                        {index < issue.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-sm">{item.status}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetails;
