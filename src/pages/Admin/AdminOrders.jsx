import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          {/* Orders Content */}
          <div className="w-full lg:w-3/4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Orders</h1>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders?.map((o, i) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                            className="w-32"
                            size="small"
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?.buyer?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(o?.createAt).fromNow()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            o?.payment.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {o?.payment.success ? "Success" : "Failed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?.products?.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {orders?.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h3>
                  <p className="text-gray-600">There are no orders to display.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;