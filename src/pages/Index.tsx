import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Users, TrendingUp, ArrowRight, Shield, Zap, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { user, logout } = useAuth();

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
              <Link to="/chatbot">AI Assistant</Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/profile">Profile</Link>
                </Button>
                <NotificationBell />
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
            <ThemeToggle />
            <Button asChild>
              <Link to="/report">Report Issue</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-info/5 to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              AI-Powered Civic Engagement
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Your Voice,
              <br />
              <span className="bg-gradient-to-r from-primary via-info to-secondary bg-clip-text text-transparent">
                Your Community
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Report civic issues, collaborate with your community, and track real-time solutions. 
              SAARTHI bridges citizens and local authorities for a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button size="lg" className="text-lg gap-2">
                  Report an Issue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="text-lg">
                  Explore Community Feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Issues Reported", value: "12,458", icon: MapPin },
              { label: "Issues Resolved", value: "9,234", icon: Shield },
              { label: "Active Citizens", value: "45,678", icon: Users },
              { label: "Response Rate", value: "94%", icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary" />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How SAARTHI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, powerful platform connecting communities with local authorities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Smart Reporting",
                description: "Upload images, add location with GPS, and let AI categorize your civic issues automatically.",
                color: "text-primary",
              },
              {
                icon: Users,
                title: "Community Power",
                description: "Upvote, comment, and collaborate on issues. Your collective voice drives faster action.",
                color: "text-secondary",
              },
              {
                icon: MessageSquare,
                title: "Real-Time Updates",
                description: "Track your complaint status, get notifications, and see transparent progress updates.",
                color: "text-accent",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-info to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of citizens making their communities better, one report at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="text-lg bg-white/10 text-white hover:bg-white/20 border-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">SAARTHI</h3>
              <p className="text-sm text-muted-foreground">
                Empowering communities through technology and transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Report Issue</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community Feed</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Track Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 SAARTHI. Building better communities together.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
