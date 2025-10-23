import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          {/* Dashboard Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {auth?.user?.name}!</h1>
              <p className="text-gray-600 text-lg">Admin Dashboard</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Information</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <span className="font-medium text-gray-700">Full Name</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{auth?.user?.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📧</span>
                    </div>
                    <span className="font-medium text-gray-700">Email Address</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{auth?.user?.email}</span>
                </div>
                
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📞</span>
                    </div>
                    <span className="font-medium text-gray-700">Contact Number</span>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {auth?.user?.phone || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;