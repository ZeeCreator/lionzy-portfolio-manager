
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { login } from "@/utils/authService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Lock, FileText, Link } from "lucide-react";

const HarisLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useUser();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from state or default to files
  const from = location.state?.from?.pathname || "/files";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (login(credentials.username, credentials.password)) {
        toast.success("Login successful!");
        loginContext();
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeatureInfo = () => {
    if (from.includes("files")) {
      return {
        icon: FileText,
        title: "File Manager Access",
        description: "Access file management features"
      };
    } else if (from.includes("shortlinks")) {
      return {
        icon: Link,
        title: "Short Links Access", 
        description: "Access short link management features"
      };
    }
    return {
      icon: Lock,
      title: "Secure Access",
      description: "Access protected features"
    };
  };

  const featureInfo = getFeatureInfo();
  const FeatureIcon = featureInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <FeatureIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            {featureInfo.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {featureInfo.description}
          </p>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HarisLogin;
