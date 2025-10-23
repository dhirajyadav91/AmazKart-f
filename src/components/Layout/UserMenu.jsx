import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FaUserCircle, 
  FaShoppingBag, 
  FaCog, 
  FaChevronRight,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBell,
  FaWallet
} from "react-icons/fa";

const UserMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard/user/profile",
      name: "Profile",
      icon: FaUserCircle,
      description: "Manage your personal information"
    },
    {
      path: "/dashboard/user/orders",
      name: "Orders",
      icon: FaShoppingBag,
      description: "View your order history"
    },
    {
      path: "/dashboard/user/notifications",
      name: "Notifications",
      icon: FaBell,
      description: "Your alerts and messages"
    },
    {
      path: "/dashboard/user/wallet",
      name: "Wallet",
      icon: FaWallet,
      description: "Payment methods & balance"
    },
    {
      path: "/dashboard/user/settings",
      name: "Settings",
      icon: FaCog,
      description: "Account preferences"
    }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaTachometerAlt className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500">Welcome back!</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <FaTachometerAlt className="text-white text-lg" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
          >
            <FaChevronRight className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center rounded-xl p-3 transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-md' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }
                    ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10 mr-3'}
                  `}>
                    <Icon className="text-sm" />
                  </div>
                  
                  {/* Text Content - Hidden when collapsed */}
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`
                          font-medium transition-colors
                          ${isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}
                        `}>
                          {item.name}
                        </span>
                        <FaChevronRight className={`
                          text-xs transition-all duration-300
                          ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}
                          ${isActive ? 'translate-x-1' : ''}
                        `} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 mt-4">
          <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all duration-300 hover:shadow-sm">
            <FaSignOutAlt className="text-sm" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 border-t border-gray-100 mt-4">
          <button className="w-full flex items-center justify-center p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all duration-300">
            <FaSignOutAlt className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;