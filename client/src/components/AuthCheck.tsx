import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CheckAuthProps {
  children: React.ReactNode;
  isProtected: boolean;
}

const CheckAuth = ({ children, isProtected }: CheckAuthProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
