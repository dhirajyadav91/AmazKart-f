import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaRupeeSign,
  FaTag,
  FaBox,
  FaClock
} from "react-icons/fa";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Get product details
  const getProduct = async () => {
    try {
      setLoading(true);
      console.log("Fetching product with slug:", params.slug);
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${params.slug}`
      );
      
      console.log("Product data received:", data);
      
      if (data?.success && data?.product) {
        setProduct(data.product);
        if (data.product.category?._id) {
          getSimilarProducts(data.product._id, data.product.category._id);
        }
      } else {
        toast.error("Product not found");
        navigate("/");
      }
    } catch (error) {
      console.log("Error fetching product:", error);
      if (error.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Something went wrong while fetching product details");
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Get similar products
  const getSimilarProducts = async (pid, cid) => {
    try {
      if (!pid || !cid) return;
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/related-product/${pid}/${cid}`
      );
      
      if (data?.success) {
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.log("Error fetching similar products:", error);
    }
  };

  // Add to cart
  const addToCart = () => {
    if (!auth?.user) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: `/product/${params.slug}` });
      return;
    }

    if (!product) return;

    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      toast.error("Item is already in your cart");
      return;
    }

    // Add item with quantity
    const itemToAdd = {
      ...product,
      cartQuantity: quantity
    };
    
    const newCart = [...cart, itemToAdd];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success(`${quantity} item(s) added to cart successfully!`);
  };

  // Buy now
  const buyNow = () => {
    if (!auth?.user) {
      toast.error("Please login to purchase");
      navigate("/login", { state: `/product/${params.slug}` });
      return;
    }

    addToCart();
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
  };

  // Render star ratings
  const renderStars = (rating = 4.2) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  // Product features
  const productFeatures = [
    { icon: FaTruck, text: "Free Delivery", subtext: "On orders above ₹499" },
    { icon: FaUndo, text: "Easy Returns", subtext: "30 Days Return Policy" },
    { icon: FaShieldAlt, text: "1 Year Warranty", subtext: "Manufacturer Warranty" },
    { icon: FaBox, text: "Genuine Product", subtext: "100% Authentic" }
  ];

  // Get product images
  const getProductImages = () => {
    const mainImage = product?.photoUrl 
      ? product.photoUrl 
      : product?._id 
        ? `${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`
        : "/images/placeholder.jpg";

    return [
      mainImage,
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    ];
  };

  useEffect(() => {
    if (params.slug) getProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const productImages = getProductImages();
  const isInCart = cart.some(item => item._id === product._id);
  const isOutOfStock = product.quantity === 0;

  return (
    <Layout title={`${product.name} - Premium Store`}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button onClick={() => navigate("/")} className="hover:text-blue-600 transition duration-200">
                  Home
                </button>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/categories")} 
                  className="hover:text-blue-600 transition duration-200"
                >
                  Categories
                </button>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <button 
                  onClick={() => product.category?.slug && navigate(`/category/${product.category.slug}`)}
                  className="hover:text-blue-600 transition duration-200"
                >
                  {product.category?.name || "Category"}
                </button>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-800 font-medium truncate max-w-xs">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Product Main Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className={`w-full h-full object-cover transition duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                      setImageLoading(false);
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isOutOfStock && (
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        Out of Stock
                      </span>
                    )}
                    {!isOutOfStock && product.quantity < 10 && (
                      <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        Low Stock
                      </span>
                    )}
                    {product.price < 1000 && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        Great Deal
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index);
                        setImageLoading(true);
                      }}
                      className={`bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition duration-200 ${
                        selectedImage === index
                          ? "border-blue-500 shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <FaTag className="text-blue-500 text-sm" />
                  <span className="text-blue-600 font-medium text-sm">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars()}
                    </div>
                    <span className="text-gray-700 font-semibold">4.2/5</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">142 Reviews</span>
                  <span className="text-gray-400">•</span>
                  <span className={`font-semibold flex items-center gap-1 ${
                    isOutOfStock ? "text-red-600" : "text-green-600"
                  }`}>
                    <FaBox className="text-sm" />
                    {isOutOfStock ? "Out of Stock" : `${product.quantity} in stock`}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-gray-800 flex items-center">
                    <FaRupeeSign className="text-3xl" />
                    {product.price?.toLocaleString('en-IN') || "0"}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-semibold">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-gray-800 font-semibold min-w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 disabled:opacity-50"
                        disabled={quantity >= product.quantity}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Max: {product.quantity} units
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={addToCart}
                    disabled={isOutOfStock || isInCart}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FaShoppingCart />
                    {isInCart ? "Added to Cart" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                  
                  <button
                    onClick={buyNow}
                    disabled={isOutOfStock}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isOutOfStock ? "Out of Stock" : "Buy Now"}
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition duration-200">
                    <FaHeart className="text-lg" />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition duration-200">
                    <FaShare className="text-lg" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-2 gap-4 pt-6">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{feature.text}</p>
                        <p className="text-gray-500 text-xs">{feature.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: "description", label: "Description" },
                  { id: "specifications", label: "Specifications" },
                  { id: "reviews", label: "Reviews" },
                  { id: "shipping", label: "Shipping Info" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No detailed description available for this product."}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">General</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">Premium Brand</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">{product.category?.name || "General"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Product Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Stock</span>
                        <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.quantity} available`}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Price</span>
                        <span className="font-medium">₹{product.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <FaTruck className="text-green-500 text-xl mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Free Delivery</h4>
                        <p className="text-gray-600 text-sm">On orders above ₹499. Delivery within 3-5 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaClock className="text-blue-500 text-xl mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Express Delivery</h4>
                        <p className="text-gray-600 text-sm">Available for ₹99. Get it within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.slug}`)}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={relatedProduct.photoUrl || `${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${relatedProduct._id}`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition duration-200">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-green-600 font-bold text-lg flex items-center">
                        <FaRupeeSign className="text-sm" />
                        {relatedProduct.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;