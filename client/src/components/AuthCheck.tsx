import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast";

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
      toast.error("Unauthorized")
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
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="bg-base-100 rounded-lg p-6 shadow-sm">
            <Skeleton height={40} width={300} className="mb-4" />
            <Skeleton height={20} width={500} />
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-base-100 rounded-lg p-6 shadow-sm">
                <Skeleton height={20} width={120} className="mb-2" />
                <Skeleton height={32} width={80} />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <Skeleton height={24} width={200} className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton height={40} width={40} circle />
                    <div className="flex-1">
                      <Skeleton height={20} width={200} className="mb-1" />
                      <Skeleton height={16} width={150} />
                    </div>
                    <Skeleton height={24} width={80} />
                    <Skeleton height={32} width={100} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default CheckAuth;
