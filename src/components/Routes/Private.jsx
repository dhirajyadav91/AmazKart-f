import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.token) {
      console.log("❌ No token - redirecting to login");
      navigate("/login", { state: { from: location } });
    }
  }, [auth?.token, navigate, location]);

  // Simple spinner while checking
  if (!auth?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}