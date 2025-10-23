import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        console.log("🔍 AdminRoute - Auth Check Started");
        console.log("🔍 Auth Token:", auth?.token);
        console.log("🔍 User Role:", auth?.user?.role);

        if (!auth?.token) {
          console.log("❌ No token found, redirecting to login");
          setLoading(false);
          navigate("/login");
          return;
        }

        // Check if user is admin (role === 1)
        if (auth?.user?.role !== 1) {
          console.log("❌ User is not admin, redirecting");
          setLoading(false);
          navigate("/");
          return;
        }

        console.log("🔍 Making admin-auth API call...");
        
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/admin-auth`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`, // Add Bearer prefix
            },
          }
        );

        if (res.data.ok) {
          console.log("✅ Admin auth successful");
          setOk(true);
        } else {
          console.log("❌ Admin auth failed");
          setOk(false);
        }
      } catch (error) {
        console.log("❌ Admin auth API error:", error);
        console.log("❌ Error response:", error.response?.data);
        
        // If token is invalid, clear auth and redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("auth");
          navigate("/login");
        }
        
        setOk(false);
      } finally {
        console.log("🔍 Loading set to false");
        setLoading(false);
      }
    };

    authCheck();
  }, [auth?.token, auth?.user?.role, navigate]);

  console.log("🔍 AdminRoute Render - ok:", ok, "loading:", loading);

  if (loading) {
    console.log("🔍 Showing spinner");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log("🔍 Rendering Outlet - ok:", ok);
  return ok ? <Outlet /> : null;
};

export default AdminRoute;