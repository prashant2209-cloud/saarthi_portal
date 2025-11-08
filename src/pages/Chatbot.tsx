import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Lightbulb, HelpCircle, FileText, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your SAARTHI AI Assistant. I can help you with:\n\n• Filing civic complaints\n• Understanding issue categories\n• Checking complaint status\n• Getting civic information\n\nHow can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        "How do I report an issue?",
        "What are the issue categories?",
        "Check my complaint status",
        "Tips for effective reporting"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickResponses: Record<string, string> = {
    "how do i report an issue": "To report an issue:\n\n1. Click the 'Report Issue' button\n2. Upload a photo of the problem\n3. Select the issue category\n4. Add your location (auto-detected or manual)\n5. Describe the issue in detail\n6. Submit your report\n\nOur AI will automatically categorize and prioritize your issue!",
    
    "what are the issue categories": "We handle various civic issues:\n\n🚗 Roads & Infrastructure\n🚮 Sanitation & Waste\n💡 Electricity & Streetlights\n💧 Water Supply\n🌳 Parks & Public Spaces\n🚨 Safety & Security\n🏢 Building & Construction\n📢 Noise Pollution\n\nSelect the most relevant category when reporting.",
    
    "check my complaint status": "To check your complaint status:\n\n1. Go to your Profile\n2. View 'My Issues' tab\n3. Click on any issue to see detailed status\n\nYou'll receive notifications for updates. Would you like me to show your recent issues?",
    
    "tips for effective reporting": "Here are tips for effective issue reporting:\n\n✅ Include clear photos\n✅ Provide exact location\n✅ Add detailed description\n✅ Select correct category\n✅ Mention urgency level\n✅ Add any safety concerns\n\nWell-documented issues get faster resolution!"
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let botResponse = "I understand you're asking about that. Let me help you!\n\nCould you provide more details or try asking:\n• How do I report an issue?\n• What are the issue categories?\n• Check my complaint status\n• Tips for effective reporting";

      // Check for keyword matches
      for (const [key, value] of Object.entries(quickResponses)) {
        if (lowerInput.includes(key) || lowerInput.includes(key.split(' ').join(''))) {
          botResponse = value;
          break;
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: botResponse,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: Object.keys(quickResponses).map(q => 
          q.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        ).slice(0, 3)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const quickActions = [
    { icon: FileText, label: "Report Issue", description: "File a new complaint" },
    { icon: TrendingUp, label: "Issue Status", description: "Track your reports" },
    { icon: HelpCircle, label: "Help Center", description: "Get assistance" },
    { icon: Lightbulb, label: "Tips & Guides", description: "Best practices" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          {/* Quick Actions Sidebar */}
          <Card className="lg:col-span-1 hidden lg:block">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="w-full p-3 rounded-lg border hover:bg-accent/5 transition-colors text-left flex items-start gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">SAARTHI AI Assistant</CardTitle>
                  <Badge variant="secondary" className="text-xs">Always Available</Badge>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                  {message.type === "bot" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col gap-2 max-w-[80%] ${message.type === "user" ? "items-end" : ""}`}>
                    <div
                      className={`p-3 rounded-lg whitespace-pre-wrap ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.type === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <CardContent className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about civic issues..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
