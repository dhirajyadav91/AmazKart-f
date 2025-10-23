import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  AiOutlineReload, 
  AiOutlineFilter, 
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineStar,
  AiFillStar,
  AiOutlineMenu,
  AiOutlineSearch,
  AiFillCheckCircle
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HomePage = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [autoHide, setAutoHide] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const mainContentRef = useRef(null);
  const productsGridRef = useRef(null);

  // Placeholder image function
  const getPlaceholderImage = (width = 300, height = 200) => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E`;
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      description: "Up to 50% off on new arrivals",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "Shop Now",
      gradient: "from-purple-600 via-pink-500 to-red-500",
      mobileImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Limited Time Offer",
      subtitle: "Don't miss out",
      description: "Free shipping on orders over $99",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "Discover Deals",
      gradient: "from-blue-600 via-teal-500 to-green-500",
      mobileImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "New Tech Gadgets",
      subtitle: "Innovation meets style",
      description: "Cutting-edge technology at your fingertips",
      image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "Explore Tech",
      gradient: "from-gray-800 via-blue-700 to-indigo-600",
      mobileImage: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Promotional banners
  const promoBanners = [
    {
      id: 1,
      title: "Flash Sale",
      subtitle: "24 Hours Only",
      discount: "30% OFF",
      bgColor: "bg-gradient-to-r from-red-500 to-orange-500",
      icon: "⚡",
      mobileBg: "bg-gradient-to-br from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Collection",
      discount: "Just In",
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
      icon: "🆕",
      mobileBg: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On All Orders",
      discount: "$99+",
      bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
      icon: "🚚",
      mobileBg: "bg-gradient-to-br from-green-500 to-teal-500"
    }
  ];

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Load more products (pagination)
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/product/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setShowFilters(false);
    getAllProducts();
  };

  // Apply filters
  const applyFilters = () => {
    filterProduct();
    setShowFilters(false);
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Buy Now function
  const handleBuyNow = (product, e) => {
    e.stopPropagation(); // Prevent navigation to product details
    
    if (!auth?.user) {
      toast.error("Please login to purchase");
      navigate("/login", { state: `/product/${product.slug}` });
      return;
    }

    // Add to cart and navigate to cart
    if (!cart.find((item) => item._id === product._id)) {
      setCart([...cart, product]);
      localStorage.setItem("cart", JSON.stringify([...cart, product]));
      toast.success("Item added to cart!");
    }
    
    setTimeout(() => {
      navigate("/cart");
    }, 500);
  };

  // Add to Cart function
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    if (!auth?.user) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: `/product/${product.slug}` });
      return;
    }

    if (!cart.find((item) => item._id === product._id)) {
      setCart([...cart, product]);
      localStorage.setItem("cart", JSON.stringify([...cart, product]));
      toast.success("Item Added to cart!");
    } else {
      toast.error("Item already in cart");
    }
  };

  // Auto scroll products when filters are visible
  useEffect(() => {
    if (showFilters && productsGridRef.current) {
      const timer = setTimeout(() => {
        productsGridRef.current.scrollTop = 0;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showFilters]);

  // Auto-hide filters on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showFilters && !autoHide && !isMobile) {
        const timer = setTimeout(() => {
          setShowFilters(false);
          setAutoHide(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    const mainElement = mainContentRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, [showFilters, autoHide, isMobile]);

  // Reset autoHide when filters are manually opened
  useEffect(() => {
    if (showFilters) {
      setAutoHide(false);
    }
  }, [showFilters]);

  // Close filters on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && isMobile) {
        const filterElement = document.querySelector('.filter-sidebar');
        if (filterElement && !filterElement.contains(event.target)) {
          setShowFilters(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters, isMobile]);

  // =============================
  // useEffect Hooks
  // =============================

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Get responsive grid classes
  const getProductsGridClass = () => {
    if (showFilters) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <Layout title="All Products - Premium Store">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile Search Bar */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 lg:hidden">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600"
                >
                  <AiOutlineFilter size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-gray-100 border-0 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button 
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 relative"
                  onClick={() => navigate("/cart")}
                >
                  <AiOutlineShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div 
          ref={mainContentRef}
          className="container mx-auto px-3 sm:px-4 py-4 sm:py-6"
        >
          
          {/* Main Banner Slider - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              navigation={!isMobile}
              pagination={{ 
                clickable: true,
                dynamicBullets: true 
              }}
              autoplay={{ delay: 5000 }}
              effect="fade"
              speed={1000}
              className="h-64 sm:h-80 md:h-96 lg:h-[500px]"
            >
              {bannerSlides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className={`relative h-full bg-gradient-to-r ${slide.gradient}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <img
                      src={isMobile ? slide.mobileImage : slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage(800, 500);
                      }}
                    />
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-white ${isMobile ? 'max-w-full text-center' : 'max-w-lg'}`}>
                          <h1 className={`font-bold mb-2 sm:mb-4 leading-tight ${
                            isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'
                          }`}>
                            {slide.title}
                          </h1>
                          <p className={`mb-1 sm:mb-2 opacity-90 ${
                            isMobile ? 'text-base' : 'text-xl md:text-2xl'
                          }`}>
                            {slide.subtitle}
                          </p>
                          <p className={`mb-4 sm:mb-6 opacity-80 ${
                            isMobile ? 'text-sm' : 'text-lg'
                          }`}>
                            {slide.description}
                          </p>
                          <button 
                            onClick={() => navigate('/products')}
                            className={`bg-white text-gray-900 font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-300 shadow-2xl ${
                              isMobile 
                                ? 'px-6 py-3 rounded-lg text-sm' 
                                : 'px-8 py-4 rounded-full text-lg'
                            }`}
                          >
                            {slide.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Promotional Banners - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {promoBanners.map((banner) => (
              <div
                key={banner.id}
                className={`${isMobile ? banner.mobileBg : banner.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transform hover:scale-105 transition duration-300 shadow-lg cursor-pointer`}
                onClick={() => navigate('/products')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} mb-2`}>{banner.icon}</div>
                    <h3 className={`font-bold mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}>{banner.title}</h3>
                    <p className="opacity-90 mb-2 text-sm sm:text-base">{banner.subtitle}</p>
                    <p className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{banner.discount}</p>
                  </div>
                  <div className={`opacity-80 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                    {banner.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Showcase - Mobile Optimized */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Shop by Category</h2>
              <button 
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                onClick={() => navigate('/categories')}
              >
                View All →
              </button>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={!isMobile}
              spaceBetween={isMobile ? 12 : 20}
              slidesPerView={isMobile ? 3 : 2}
              breakpoints={{
                480: { slidesPerView: 3 },
                640: { slidesPerView: 4 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 }
              }}
              className="category-swiper"
            >
              {categories.map((category) => (
                <SwiperSlide key={category._id}>
                  <div 
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/category/${category.slug}`)}
                  >
                    <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition duration-300 ${
                      isMobile ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'
                    }`}>
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition duration-200 line-clamp-1">
                      {category.name}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {category.products?.length || 0} items
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Products Header with Filter Button - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Products
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                Discover {total} amazing products
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Active Filters Badges - Mobile Optimized */}
              {(checked.length > 0 || radio.length > 0) && (
                <div className="flex flex-wrap gap-1 sm:gap-2 flex-1 sm:flex-initial">
                  {checked.map((catId) => {
                    const category = categories.find(c => c._id === catId);
                    return category ? (
                      <span 
                        key={catId}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center shadow-sm"
                      >
                        {isMobile ? category.name.substring(0, 8) + '...' : category.name}
                        <button
                          onClick={() => handleFilter(false, catId)}
                          className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                  {radio.length > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                      Price
                      <button
                        onClick={() => setRadio([])}
                        className="ml-1 text-green-600 hover:text-green-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
              
              {/* Filter Toggle Button - Mobile Optimized */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
              >
                <AiOutlineFilter className="text-sm sm:text-lg" />
                <span className="hidden sm:inline">Filters</span>
                {(checked.length > 0 || radio.length > 0) && (
                  <span className="bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {checked.length + (radio.length > 0 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main Content Area - Fully Responsive */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 relative min-h-screen">
            {/* Filter Sidebar - Responsive Design */}
            {showFilters && (
              <div className={`filter-sidebar bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 transition-all duration-500 z-20 overflow-y-auto ${
                isMobile 
                  ? 'fixed inset-4 top-16 bottom-4 z-50' 
                  : 'w-80 h-[calc(100vh-120px)] sticky top-24'
              }`}>
                {/* Filter Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200/50 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Filters</h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {(checked.length > 0 || radio.length > 0) && (
                        <button
                          onClick={resetFilters}
                          className="text-blue-500 text-xs sm:text-sm font-semibold hover:text-blue-600 transition duration-200"
                        >
                          Clear All
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <AiOutlineClose size={isMobile ? 18 : 20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="p-4 sm:p-6 border-b border-gray-200/50">
                  <h4 className="font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    Categories
                  </h4>
                  <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar">
                    {categories?.map((c) => (
                      <div key={c._id} className="flex items-center p-1 sm:p-2 hover:bg-blue-50 rounded-lg transition duration-200">
                        <Checkbox
                          onChange={(e) => handleFilter(e.target.checked, c._id)}
                          checked={checked.includes(c._id)}
                          className="text-gray-700 text-sm sm:text-base"
                        >
                          <span className="text-xs sm:text-sm font-medium">{c.name}</span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="p-4 sm:p-6 border-b border-gray-200/50">
                  <h4 className="font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
                    Price Range
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <Radio.Group 
                      onChange={(e) => setRadio(e.target.value)} 
                      value={radio}
                      className="w-full"
                    >
                      {Prices?.map((p) => (
                        <div key={p._id} className="flex items-center p-1 sm:p-2 hover:bg-green-50 rounded-lg transition duration-200">
                          <Radio 
                            value={p.array} 
                            className="text-gray-700 w-full text-sm sm:text-base"
                          >
                            <span className="text-xs sm:text-sm font-medium">{p.name}</span>
                          </Radio>
                        </div>
                      ))}
                    </Radio.Group>
                  </div>
                </div>

                {/* Popular Products in Filter */}
                <div className="p-4 sm:p-6 border-b border-gray-200/50">
                  <h4 className="font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full mr-2 sm:mr-3"></span>
                    Popular Products
                  </h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {products.slice(0, isMobile ? 2 : 4).map((product) => (
                      <div 
                        key={`filter-${product._id}`} 
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md group"
                        onClick={() => {
                          navigate(`/product/${product.slug}`);
                          setShowFilters(false);
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`}
                          className={`object-cover rounded-lg group-hover:scale-105 transition duration-300 ${
                            isMobile ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'
                          }`}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = getPlaceholderImage(100, 100);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition duration-200">
                            {product.name}
                          </p>
                          <p className="text-green-600 font-bold text-xs sm:text-sm">₹{product.price}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <AiFillStar className="text-yellow-400 text-xs" />
                            <span className="text-gray-600 text-xs">4.2</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product, e);
                          }}
                          className={`p-1 sm:p-2 rounded-lg transition duration-200 ${
                            cart.find((item) => item._id === product._id)
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                          disabled={cart.find((item) => item._id === product._id)}
                        >
                          {cart.find((item) => item._id === product._id) ? (
                            <AiFillCheckCircle size={isMobile ? 14 : 16} />
                          ) : (
                            <AiOutlineShoppingCart size={isMobile ? 14 : 16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="p-4 sm:p-6 bg-white sticky bottom-0 border-t border-gray-200/50">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid - Fully Responsive */}
            <div 
              ref={productsGridRef}
              className={`transition-all duration-500 ${
                showFilters && !isMobile
                  ? 'flex-1 h-[calc(100vh-120px)] overflow-y-auto' 
                  : 'w-full'
              }`}
            >
              {products.length > 0 ? (
                <>
                  <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${getProductsGridClass()}`}>
                    {products?.map((p) => (
                      <div
                        key={p._id}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-500 overflow-hidden group cursor-pointer"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                            className="w-full h-48 sm:h-56 lg:h-60 object-cover group-hover:scale-105 transition duration-500"
                            alt={p.name}
                            onError={(e) => {
                              e.target.src = getPlaceholderImage(300, 200);
                            }}
                          />
                          
                          {/* Product Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 sm:gap-2">
                            {p.quantity < 10 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                Almost Gone
                              </span>
                            )}
                            {cart.find((item) => item._id === p._id) && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                In Cart
                              </span>
                            )}
                          </div>

                          {/* Action Buttons - Only Wishlist and View */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(p._id);
                              }}
                              className="bg-white/90 backdrop-blur-sm p-1 sm:p-2 rounded-full shadow-lg hover:bg-red-50 transition duration-200"
                            >
                              {wishlist.includes(p._id) ? (
                                <AiFillHeart className="text-red-500 text-base sm:text-lg" />
                              ) : (
                                <AiOutlineHeart className="text-gray-600 text-base sm:text-lg" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${p.slug}`);
                              }}
                              className="bg-white/90 backdrop-blur-sm p-1 sm:p-2 rounded-full shadow-lg hover:bg-blue-50 transition duration-200"
                            >
                              <AiOutlineEye className="text-gray-600 text-base sm:text-lg" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 lg:p-6">
                          <h5 className="font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition duration-200 text-sm sm:text-base lg:text-lg">
                            {p.name}
                          </h5>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div>
                              <p className="text-green-600 font-bold text-lg sm:text-xl">₹{p.price}</p>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <p className="text-gray-400 text-xs sm:text-sm line-through">₹{p.originalPrice}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <AiFillStar className="text-yellow-400 text-sm sm:text-base" />
                              <span className="text-gray-700 font-semibold text-sm sm:text-base">4.2</span>
                              <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">(42)</span>
                            </div>
                          </div>

                          {/* Action Buttons Row - Buy Now and Added Button */}
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm flex items-center justify-center gap-1"
                              onClick={(e) => handleBuyNow(p, e)}
                            >
                              Buy Now
                            </button>
                            
                            {cart.find((item) => item._id === p._id) && (
                              <button
                                className="flex-1 bg-green-100 text-green-700 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-1 cursor-default"
                                disabled
                              >
                                <AiFillCheckCircle className="text-sm" />
                                Added
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {products && products.length < total && (
                    <div className="mt-8 sm:mt-12 text-center">
                      <button
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 sm:py-4 px-8 sm:px-12 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center mx-auto disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <AiOutlineReload className="animate-spin mr-2 sm:mr-3 text-base sm:text-xl" />
                            Loading...
                          </span>
                        ) : (
                          <>
                            <AiOutlineReload className="mr-2 sm:mr-3 text-base sm:text-xl" />
                            Load More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-12 lg:p-16 text-center">
                  <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📦</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4">No products found</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-lg">Try changing your filters or search terms</p>
                  <button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar and animations */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .category-swiper .swiper-button-next,
        .category-swiper .swiper-button-prev {
          color: #4f46e5;
          background: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .category-swiper .swiper-button-next:after,
        .category-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .category-swiper .swiper-button-next,
          .category-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;