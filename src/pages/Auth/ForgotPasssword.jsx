import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`, {
        email,
        newPassword,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Forgot Password - Ecommerce APP"}>
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-2xl font-bold text-center text-gray-800 mb-2">RESET PASSWORD</h4>
            <p className="text-center text-gray-600 mb-6">Enter your details to reset your password</p>
            
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter Your Email"
                required
              />
            </div>

            {/* Security Question Input */}
            <div>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter Your Favorite Sport Name"
                required
              />
            </div>

            {/* New Password Input */}
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter Your New Password"
                required
              />
            </div>

            {/* Reset Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              RESET PASSWORD
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;