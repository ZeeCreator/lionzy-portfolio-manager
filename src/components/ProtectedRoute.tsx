
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = isAuthenticated();
  
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
