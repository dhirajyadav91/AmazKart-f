import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  
  return (
    <Layout title={"Your Orders"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <UserMenu />
          </div>
          
          {/* Orders Content */}
          <div className="w-full lg:w-3/4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Orders</h1>
            
            {orders?.map((o, i) => {
              return (
                <div key={o._id} className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                  {/* Order Summary Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              o?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              o?.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              o?.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {o?.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{o?.buyer?.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{moment(o?.createAt).fromNow()}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              o?.payment.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {o?.payment.success ? "Success" : "Failed"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Order Products */}
                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {o?.products?.map((p, index) => (
                        <div key={p._id} className="flex flex-col md:flex-row items-center bg-white rounded-lg border border-gray-200 p-4">
                          <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                            <img
                              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                              className="w-20 h-20 object-cover rounded-lg"
                              alt={p.name}
                            />
                          </div>
                          <div className="md:w-3/4 md:pl-6">
                            <p className="font-semibold text-gray-800 text-lg">{p.name}</p>
                            <p className="text-gray-600 text-sm mt-1">{p.description.substring(0, 30)}...</p>
                            <p className="text-green-600 font-bold mt-2">Price: ${p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {orders?.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h3>
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;