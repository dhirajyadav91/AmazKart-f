import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
              <Link
                to="/dashboard/admin/create-product"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Add Product
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products?.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/dashboard/admin/product/${p.slug}`} className="flex items-center space-x-3">
                            <img
                              src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                              className="w-12 h-12 object-cover rounded"
                              alt={p.name}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{p.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{p.description}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/dashboard/admin/product/${p.slug}`}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;