import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  imageUrl?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("activeUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: User) => {
    sessionStorage.setItem("activeUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("activeUser");
    setUser(null);
    navigate("/choose-account");
  };

  return { user, login, logout };
}
