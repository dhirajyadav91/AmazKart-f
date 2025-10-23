import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  // Get authentication token - FIXED
  const getAuthToken = () => {
    try {
      // Try to get token from localStorage
      let tokenData = localStorage.getItem("token");
      console.log("🔍 Raw token data:", tokenData);

      let token = null;

      // Check if token is stored as object string
      if (tokenData && tokenData.startsWith("{")) {
        try {
          const parsedData = JSON.parse(tokenData);
          token = parsedData.token;
          console.log("✅ Extracted token from object:", token ? "Yes" : "No");
        } catch (parseError) {
          console.error("❌ Error parsing token:", parseError);
          token = tokenData; // Use as string if parsing fails
        }
      } else {
        token = tokenData; // Token is already a string
      }

      // If still no token, check all localStorage keys
      if (!token) {
        console.log("🔍 Searching for token in all localStorage keys...");
        const allKeys = Object.keys(localStorage);
        for (let key of allKeys) {
          const value = localStorage.getItem(key);
          if (value && value.includes("eyJhbGciOiJ")) { // JWT pattern
            console.log("🔑 Found token in key:", key);
            token = value;
            break;
          }
        }
      }

      console.log("🔑 Final token:", token ? "FOUND" : "NOT FOUND");
      return token;
    } catch (error) {
      console.error("❌ Error getting token:", error);
      return null;
    }
  };

  //get single product - FIXED WITH AUTH
  const getSingleProduct = async () => {
    try {
      const token = getAuthToken();
      console.log("🔄 Fetching product with slug:", params.slug);
      
      const config = {
        headers: {}
      };

      // Add authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Making authenticated request");
      } else {
        console.warn("⚠️ Making request without token");
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${params.slug}`,
        config
      );
      
      if (data?.success) {
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping ? "1" : "0");
        setCategory(data.product.category?._id || data.product.category);
        console.log("✅ Product data loaded:", data.product);
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Error loading product details");
      }
    }
  };

  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, [params.slug]);

  //get all category - FIXED WITH AUTH
  const getAllCategory = async () => {
    try {
      const token = getAuthToken();
      
      const config = {
        headers: {}
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`,
        config
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Something went wrong in getting category");
      }
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update product function - FIXED WITH AUTH
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login first to update products");
      return;
    }

    setLoading(true);
    
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("category", category);
      
      // Only append photo if a new one is selected
      if (photo) {
        productData.append("photo", photo);
      }

      console.log("🔄 Updating product...", {
        id,
        name,
        price,
        category,
        hasNewPhoto: !!photo,
        hasToken: !!token
      });

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/product/update-product/${id}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // ✅ ADDED AUTH HEADER
          },
        }
      );

      if (data?.success) {
        toast.success(data?.message || "Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  //delete a product - FIXED WITH AUTH
  const handleDelete = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login first to delete products");
      return;
    }

    try {
      let answer = window.prompt("Are You Sure want to delete this product? Type 'YES' to confirm.");
      if (answer?.toUpperCase() !== "YES") return;
      
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ ADDED AUTH HEADER
          },
        }
      );
      
      if (data?.success) {
        toast.success("Product Deleted Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Product</h1>
              
              <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    bordered={false}
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    className="w-full"
                    onChange={(value) => setCategory(value)}
                    value={category}
                  >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Photo
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-600">
                        {photo ? photo.name : "Click to change product photo"}
                      </span>
                    </div>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo Preview */}
                <div className="flex justify-center">
                  <div className="border border-gray-200 rounded-lg p-4">
                    {photo ? (
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo"
                        className="h-48 w-auto object-cover rounded"
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${id}`}
                        alt="product_photo"
                        className="h-48 w-auto object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
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
                    Description
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
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={price}
                      placeholder="Enter price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Available
                  </label>
                  <Select
                    bordered={false}
                    placeholder="Select shipping option"
                    size="large"
                    className="w-full"
                    onChange={(value) => setShipping(value)}
                    value={shipping}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`flex-1 font-medium py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-offset-2 ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
                    }`}
                  >
                    {loading ? "UPDATING..." : "UPDATE PRODUCT"}
                  </button>
                  <button 
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    DELETE PRODUCT
                  </button>
                </div>

                {/* Cancel Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/admin/products")}
                    className="text-gray-600 hover:text-gray-800 font-medium transition duration-200"
                  >
                    ← Back to Products
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

export default UpdateProduct;