import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaCog,
  FaPlusCircle,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaChevronRight,
  FaShieldAlt,
  FaChartBar,
  FaTags,
  FaBoxOpen,
  FaListAlt
} from "react-icons/fa";

const AdminMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const adminMenuItems = [
    {
      path: "/dashboard/admin/create-category",
      name: "Create Category",
      icon: FaTags,
      description: "Add new product categories",
      color: "from-green-500 to-emerald-600"
    },
    {
      path: "/dashboard/admin/create-product",
      name: "Create Product",
      icon: FaPlusCircle,
      description: "Add new products to inventory",
      color: "from-blue-500 to-cyan-600"
    },
    {
      path: "/dashboard/admin/products",
      name: "Manage Products",
      icon: FaBoxOpen,
      description: "View and edit all products",
      color: "from-purple-500 to-indigo-600"
    },
    {
      path: "/dashboard/admin/orders",
      name: "Order Management",
      icon: FaShoppingBag,
      description: "Process and track orders",
      color: "from-orange-500 to-red-500"
    },
    {
      path: "/dashboard/admin/users",
      name: "User Management",
      icon: FaUsers,
      description: "Manage system users",
      color: "from-pink-500 to-rose-600"
    },
    {
      path: "/dashboard/admin/analytics",
      name: "Analytics",
      icon: FaChartBar,
      description: "View business insights",
      color: "from-teal-500 to-blue-600"
    }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-20' : 'w-80'}`}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border border-yellow-300">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-sm text-blue-200">Administrative Controls</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border border-yellow-300 mx-auto">
              <FaShieldAlt className="text-white text-lg" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-white backdrop-blur-sm"
          >
            <FaChevronRight className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex justify-between items-center text-xs">
            <div className="text-center">
              <div className="font-semibold text-gray-800">24</div>
              <div className="text-gray-500">New Orders</div>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">156</div>
              <div className="text-gray-500">Products</div>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">12</div>
              <div className="text-gray-500">Alerts</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {adminMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center rounded-xl p-3 transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-md border border-transparent'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full shadow-lg" />
                  )}
                  
                  {/* Icon with Gradient Background */}
                  <div className={`
                    flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm
                    ${isActive 
                      ? `bg-gradient-to-br ${item.color} text-white shadow-lg transform scale-110` 
                      : 'bg-gray-100 text-gray-600 group-hover:shadow-lg group-hover:transform group-hover:scale-105'
                    }
                    ${isCollapsed ? 'w-12 h-12' : 'w-12 h-12 mr-4'}
                  `}>
                    <Icon className="text-lg" />
                  </div>
                  
                  {/* Text Content - Hidden when collapsed */}
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`
                          font-semibold transition-colors
                          ${isActive ? 'text-blue-700' : 'text-gray-800 group-hover:text-gray-900'}
                        `}>
                          {item.name}
                        </span>
                        <FaChevronRight className={`
                          text-xs transition-all duration-300
                          ${isActive ? 'text-blue-500 transform translate-x-1' : 'text-gray-400 group-hover:text-gray-600'}
                        `} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-700">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-gray-300 text-xs mt-1">{item.description}</div>
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Actions Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              <FaCog className="text-sm" />
              <span className="font-semibold">System Settings</span>
            </button>
            <div className="flex space-x-2">
              <button className="flex-1 py-2 px-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-medium text-gray-700 transition-colors duration-200">
                Help
              </button>
              <button className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-medium text-white transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 hover:shadow-lg">
              <FaCog className="text-sm mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;