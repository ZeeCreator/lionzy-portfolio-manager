
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isAuthenticated, logout } from "@/utils/authService";

interface UserContextType {
  isLoggedIn: boolean;
  login: () => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Check authentication on mount
    setIsLoggedIn(isAuthenticated());
  }, []);
  
  const login = () => {
    setIsLoggedIn(true);
  };
  
  const logoutUser = () => {
    logout();
    setIsLoggedIn(false);
  };
  
  return (
    <UserContext.Provider value={{ isLoggedIn, login, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
