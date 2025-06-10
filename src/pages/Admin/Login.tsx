
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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useUser();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (login(credentials.username, credentials.password)) {
        toast.success("Masuk berhasil!");
        loginContext();
        navigate(from, { replace: true });
      } else {
        toast.error("Kredensial tidak valid. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Masuk gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeatureInfo = () => {
    if (from.includes("files")) {
      return {
        icon: FileText,
        title: "Akses Pengelola File",
        description: "Akses fitur pengelolaan file"
      };
    } else if (from.includes("shortlinks")) {
      return {
        icon: Link,
        title: "Akses Tautan Pendek", 
        description: "Akses fitur pengelolaan tautan pendek"
      };
    }
    return {
      icon: Lock,
      title: "Dasbor Admin",
      description: "Akses ke dasbor administrator"
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
            <CardTitle className="text-2xl text-center">Masuk</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Masukkan nama pengguna"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
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
            ← Kembali ke beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
