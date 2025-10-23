import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  useEffect(() => {
    if (params?.slug) {
      getProductsByCat();
    }
  }, [params?.slug]);
  
  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category || null);
    } catch (error) {
      console.log("Error fetching category products:", error);
      toast.error("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    if (!auth?.user) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: `/category/${params.slug}` });
      return;
    }

    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      toast.error("Item is already in your cart");
      return;
    }

    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item Added to cart");
  };

  // Placeholder image function
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={category?.name ? `${category.name} - Category` : "Category"}>
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {category?.name || "Category"}
          </h1>
          <p className="text-gray-600 text-lg">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div 
                className="w-full" 
                key={p._id}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div 
                    className="relative overflow-hidden"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = getPlaceholderImage();
                      }}
                    />
                    
                    {/* In Cart Badge */}
                    {cart.find((item) => item._id === p._id) && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          In Cart
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 
                        className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition duration-200 cursor-pointer line-clamp-2 flex-1 mr-2"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        {p.name}
                      </h3>
                      <p className="text-xl font-bold text-green-600 whitespace-nowrap">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {p.description || "No description available"}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        View Details
                      </button>
                      <button
                        className={`flex-1 font-medium py-2 px-4 rounded-lg transition duration-200 text-sm ${
                          cart.find((item) => item._id === p._id)
                            ? "bg-green-100 text-green-700 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-900 text-white"
                        }`}
                        onClick={(e) => handleAddToCart(p, e)}
                        disabled={cart.find((item) => item._id === p._id)}
                      >
                        {cart.find((item) => item._id === p._id) ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">No products available in this category yet.</p>
            <button
              onClick={() => navigate("/categories")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Browse All Categories
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;