import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <UserMenu />
          </div>
          
          {/* Dashboard Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">User Information</h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded-lg">{auth?.user?.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded-lg">{auth?.user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Address</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {auth?.user?.address || "No address provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;