
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, FolderOpen, Users, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [isLoggedIn, navigate]);
  
  const dashboardCards = [
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      icon: FolderOpen,
      link: "/admin/projects",
    },
    {
      title: "Skills",
      description: "Update your skills and expertise",
      icon: Users,
      link: "/admin/skills",
    },
    {
      title: "Messages",
      description: "View and respond to contact messages",
      icon: Mail,
      link: "/admin/messages",
    },
    {
      title: "Site Settings",
      description: "Update general site settings",
      icon: Settings,
      link: "/settings",
    },
  ];
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your portfolio website</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link to={card.link}>Manage</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
