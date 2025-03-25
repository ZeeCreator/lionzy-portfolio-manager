
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { getSettings } from "@/utils/settingsService";
import { SiteSettings } from "@/types";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser } = useUser();

  useEffect(() => {
    setSettings(getSettings());
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);
  
  const handleLogin = () => {
    navigate("/admin/login");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!settings) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            {settings.siteName}
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`subtle-underline text-sm font-medium ${
                        location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                
                {isLoggedIn && (
                  <li>
                    <Link
                      to="/dashboard"
                      className="subtle-underline text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center" 
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-foreground p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-nav animate-fade-in">
          <nav className="container mx-auto py-6 px-6">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`block text-lg py-2 ${
                      location.pathname === link.href ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              
              {isLoggedIn && (
                <li>
                  <Link
                    to="/dashboard"
                    className="block text-lg py-2 text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              
              <li className="pt-4 border-t border-border">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-lg py-2 text-muted-foreground"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    className="block text-lg py-2 text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
