import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, Camera, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

const ReportIssue = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Issue Reported Successfully!",
      description: "Your complaint has been submitted and is being reviewed.",
    });
  };

  const categories = [
    "Roads & Potholes",
    "Water Supply",
    "Garbage & Sanitation",
    "Street Lights",
    "Drainage",
    "Public Safety",
    "Parks & Recreation",
    "Other",
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

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
            <p className="text-muted-foreground">
              Help improve your community by reporting civic issues. Your voice matters.
            </p>
          </div>

          <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Large pothole on Main Street"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, "-")}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Photo</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImage(null);
                        setPreviewUrl("");
                      }}
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (max. 10MB)
                    </p>
                  </label>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Enter address or landmark"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use GPS
                </Button>
              </div>
            </div>

            {/* Priority Notice */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-accent mb-1">Priority Assessment</p>
                <p className="text-muted-foreground">
                  Our AI will automatically categorize and prioritize your issue based on severity and community impact.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                Submit Report
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save Draft
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Tips for Better Reports
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Take clear photos showing the issue from multiple angles</li>
            <li>• Provide specific location details (street name, landmarks)</li>
            <li>• Describe the impact on your community</li>
            <li>• Check if a similar issue has already been reported</li>
          </ul>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
