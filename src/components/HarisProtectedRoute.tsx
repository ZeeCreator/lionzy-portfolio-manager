
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/authService";

interface HarisProtectedRouteProps {
  children: React.ReactNode;
}

const HarisProtectedRoute = ({ children }: HarisProtectedRouteProps) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  
  if (!isAuth) {
    return (
      <Navigate 
        to="/haris/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  return <>{children}</>;
};

export default HarisProtectedRoute;
