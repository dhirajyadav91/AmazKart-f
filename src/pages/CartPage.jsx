import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaShoppingBag, FaTrash, FaRupeeSign, FaMapMarkerAlt, FaLock, FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Total price in rupees
  const totalPrice = () => {
    try {
      const total = cart.reduce((total, item) => total + item.price, 0);
      return `₹${total.toLocaleString('en-IN')}`;
    } catch (error) {
      console.log(error);
      return "₹0";
    }
  };

  // Delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/product/braintree/payment`, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully 🎉");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  // Proceed to checkout - UPDATED TO NAVIGATE TO CHECKOUT PAGE
  const proceedToCheckout = () => {
    if (!auth?.token) {
      navigate("/login", { state: "/cart" });
      return;
    }
    
    if (!auth?.user?.address) {
      toast.error("Please add your delivery address first");
      navigate("/dashboard/user/profile");
      return;
    }
    
    // Navigate to checkout page
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center border border-blue-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-white text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {!auth?.user
                  ? "Hello Guest 👋"
                  : `Welcome, ${auth?.user?.name}!`}
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              {cart?.length
                ? `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart ${auth?.token ? "" : " - please login to checkout!"}`
                : "Your shopping cart is empty 🛒"}
            </p>
          </div>

          {cart?.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="lg:w-7/12">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaShoppingBag className="text-blue-500" />
                    Shopping Cart ({cart.length} items)
                  </h2>
                  <div className="space-y-4">
                    {cart?.map((p) => (
                      <div key={p._id} className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-md border border-blue-100 p-6 flex flex-col md:flex-row items-center transition-all duration-300 hover:shadow-lg">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                            alt={p.name}
                          />
                        </div>
                        <div className="md:w-2/4 px-4 text-center md:text-left">
                          <p className="font-bold text-gray-800 text-lg mb-2">{p.name}</p>
                          <p className="text-gray-600 text-sm mb-3">
                            {p.description.substring(0, 50)}...
                          </p>
                          <p className="text-green-600 font-bold text-lg flex items-center justify-center md:justify-start gap-1">
                            <FaRupeeSign className="text-sm" />
                            {p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="md:w-1/4 flex justify-center md:justify-end">
                          <button
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                            onClick={() => removeCartItem(p._id)}
                          >
                            <FaTrash className="text-sm" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart Summary Section */}
              <div className="lg:w-5/12">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaLock className="text-green-500" />
                    Order Summary
                  </h2>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                      <span className="font-semibold text-gray-800">{totalPrice()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Taxes</span>
                      <span className="font-semibold text-gray-800">Included</span>
                    </div>
                    <div className="flex justify-between items-center py-4 bg-blue-50 rounded-lg px-4">
                      <span className="text-lg font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                        <FaRupeeSign />
                        {cart.reduce((total, item) => total + item.price, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Address Section */}
                  {auth?.user?.address ? (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-500" />
                        Delivery Address
                      </h4>
                      <p className="text-gray-600 text-sm bg-white p-3 rounded-lg border">
                        {auth?.user?.address}
                      </p>
                      <button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 mt-3 flex items-center justify-center gap-2"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Change Address
                      </button>
                    </div>
                  ) : (
                    <div className="mb-6">
                      {auth?.token ? (
                        <button
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                          onClick={() => navigate("/dashboard/user/profile")}
                        >
                          <FaMapMarkerAlt />
                          Add Delivery Address
                        </button>
                      ) : (
                        <button
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                          onClick={() => navigate("/login", { state: "/cart" })}
                        >
                          Login to Checkout
                        </button>
                      )}
                    </div>
                  )}

                  {/* Checkout Button - UPDATED TO NAVIGATE TO CHECKOUT PAGE */}
                  {auth?.user?.address && (
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 mb-4"
                      onClick={proceedToCheckout}
                    >
                      <FaLock />
                      Proceed to Checkout
                      <FaArrowRight />
                    </button>
                  )}

                  {/* Payment Section - REMOVED FROM CART PAGE */}
                  {/* Payment will now be handled in the checkout page */}

                  {/* Continue Shopping */}
                  <button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition duration-200 mt-4"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty Cart State */}
          {cart?.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingBag className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Your cart feels lonely 😔</h3>
                <p className="text-gray-600 mb-8">Add some amazing products to your cart and let's get shopping!</p>
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
                  onClick={() => navigate("/")}
                >
                  Start Shopping Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;