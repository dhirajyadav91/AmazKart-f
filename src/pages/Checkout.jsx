import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaShoppingBag,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaLock,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

const Checkout = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India"
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize form with user data if available
  useEffect(() => {
    if (auth?.user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        address: auth.user.address || "",
        city: auth.user.city || "",
        state: auth.user.state || "",
        pinCode: auth.user.pinCode || ""
      }));
    }
  }, [auth?.user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart?.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const shippingCharge = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + shippingCharge + tax;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pinCode'];
    for (let field of required) {
      if (!shippingInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(shippingInfo.pinCode)) {
      toast.error("Please enter a valid 6-digit PIN code");
      return false;
    }

    return true;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call for order placement
      const orderData = {
        shippingInfo,
        paymentMethod,
        orderNotes,
        items: cart,
        subtotal,
        shippingCharge,
        tax,
        totalAmount,
        status: "confirmed"
      };

      // Here you would typically make an API call to your backend
      console.log("Order Data:", orderData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      localStorage.removeItem("cart");
      setCart([]);
      
      toast.success("Order placed successfully! 🎉");
      navigate("/order-success", { state: { orderId: `ORD${Date.now()}`, orderData } });
      
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart?.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No items in cart</h2>
            <button 
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <FaArrowLeft />
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-gray-800 text-center">Checkout</h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:w-7/12 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={shippingInfo.pinCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6-digit PIN code"
                      maxLength="6"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="House no., Street, Area"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your city"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your state"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-green-500" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {[
                    { id: "card", name: "Credit/Debit Card", icon: FaCreditCard },
                    { id: "upi", name: "UPI Payment", icon: FaRupeeSign },
                    { id: "cod", name: "Cash on Delivery", icon: FaTruck },
                    { id: "netbanking", name: "Net Banking", icon: FaShieldAlt }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <method.icon className="mx-3 text-gray-600" />
                      <span className="font-medium text-gray-800">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Notes (Optional)</h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-5/12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-500" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${item._id}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-green-600 font-bold flex items-center gap-1">
                          <FaRupeeSign className="text-xs" />
                          {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="flex items-center gap-1">
                      <FaRupeeSign className="text-xs" />
                      {subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingCharge === 0 ? "text-green-600" : ""}>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span className="flex items-center gap-1">
                      <FaRupeeSign className="text-xs" />
                      {tax.toFixed(0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="flex items-center gap-1">
                        <FaRupeeSign />
                        {totalAmount.toFixed(0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <FaLock className="text-green-500" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Place Order • ₹{totalAmount.toFixed(0).toLocaleString('en-IN')}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;