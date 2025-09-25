import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface CheckAuthProps {
  children: React.ReactNode;
  isProtected: boolean;
}

const CheckAuth = ({ children, isProtected }: CheckAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (location.pathname === "/admin" && role === "user") {
      navigate("/");
    }

    if (isProtected) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, isProtected]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return children;
};

export default CheckAuth;
