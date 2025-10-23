import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log("Get categories error:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function - IMPROVED
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !description || !price || !category || !quantity || !shipping || !photo) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      console.log("🟢 Starting product creation...");
      
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      // Log FormData contents for debugging
      console.log("📦 FormData contents:");
      for (let [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/create-product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ API Response:", data);

      if (data?.success) {
        toast.success("Product Created Successfully");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setShipping("");
        setPhoto("");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("❌ Create product error:", error);
      console.log("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message
      });
      
      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login as admin");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || "Validation error");
      } else if (error.response?.status === 500) {
        toast.error("Server error - Please check backend console");
      } else {
        toast.error("Something went wrong while creating product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>
                <button
                  onClick={() => navigate("/dashboard/admin/products")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  ← Back to Products
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6 max-w-2xl">
                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select
                    bordered={false}
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    className="w-full"
                    onChange={(value) => setCategory(value)}
                    value={category || undefined}
                    disabled={categories.length === 0}
                  >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      No categories available. Please create a category first.
                    </p>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Photo *
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 bg-gray-50">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-600">
                        {photo ? photo.name : "Click to upload product photo"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, WEBP (Max: 1MB)</p>
                    </div>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                {/* Photo Preview */}
                {photo && (
                  <div className="flex justify-center">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo"
                        className="h-48 w-auto object-cover rounded"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Preview: {photo.name} ({(photo.size / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="Enter quantity"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Available *
                  </label>
                  <Select
                    bordered={false}
                    placeholder="Select shipping option"
                    size="large"
                    className="w-full"
                    onChange={(value) => setShipping(value)}
                    value={shipping || undefined}
                    required
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                {/* Submit Button */}
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={loading || categories.length === 0}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Product...
                      </>
                    ) : (
                      "CREATE PRODUCT"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;