
import { useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Users, Mail, Settings, LogOut } from "lucide-react";
import { logout } from "@/utils/authService";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("projects");
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };
  
  const tabs = [
    { id: "projects", label: "Projects", icon: FolderOpen, path: "/admin/projects" },
    { id: "skills", label: "Skills", icon: Users, path: "/admin/skills" },
    { id: "messages", label: "Messages", icon: Mail, path: "/admin/messages" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white hidden md:block">
          <nav className="py-6 px-3 space-y-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </Link>
            ))}
            
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5 mr-2" />
              Site Settings
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
