import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    setIsUserOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleUser = () => {
    setIsUserOpen(!isUserOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <span>🛒</span>
              <span>Shoplx</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <SearchInput />
              
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleCategories}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-200 flex items-center space-x-1"
                >
                  <span>Categories</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/categories"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      All Categories
                    </Link>
                    {categories?.map((c) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Links */}
              {!auth?.user ? (
                <>
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                        isActive 
                          ? "text-blue-600 bg-blue-50" 
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                        isActive 
                          ? "text-blue-600 bg-blue-50" 
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                </>
              ) : (
                <>
                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={toggleUser}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-200 flex items-center space-x-1"
                    >
                      <span>{auth?.user?.name}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isUserOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Cart */}
              <NavLink 
                to="/cart" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center space-x-1 ${
                    isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`
                }
              >
                <Badge count={cart?.length} showZero offset={[10, -5]}>
                  <span>Cart</span>
                </Badge>
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="space-y-2">
                <SearchInput />
                
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                      isActive 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>

                <div className="px-3 py-2">
                  <button
                    onClick={toggleCategories}
                    className="flex items-center justify-between w-full text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
                  >
                    <span>Categories</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCategoriesOpen && (
                    <div className="mt-2 space-y-1 pl-4">
                      <Link
                        to="/categories"
                        className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All Categories
                      </Link>
                      {categories?.map((c) => (
                        <Link
                          key={c._id}
                          to={`/category/${c.slug}`}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {!auth?.user ? (
                  <>
                    <NavLink 
                      to="/register" 
                      className={({ isActive }) => 
                        `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                          isActive 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </NavLink>
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => 
                        `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                          isActive 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </NavLink>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <button
                        onClick={toggleUser}
                        className="flex items-center justify-between w-full text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
                      >
                        <span>{auth?.user?.name}</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isUserOpen && (
                        <div className="mt-2 space-y-1 pl-4">
                          <Link
                            to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                            className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block py-2 text-sm text-gray-600 hover:text-blue-600 text-left w-full"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                      isActive 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span>Cart</span>
                    <Badge count={cart?.length} showZero />
                  </div>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;