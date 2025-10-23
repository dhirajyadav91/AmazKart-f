import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt, FaLock, FaArrowRight } from "react-icons/fa";

const Spinner = ({ path = "login", message = "Secure Redirect" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }
    
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Glass Morphism Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 p-8 text-center shadow-2xl">
          
          {/* Security Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-emerald-400/30">
            <FaLock className="text-white text-2xl" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{message}</h1>
          <p className="text-gray-400 mb-6">You'll be redirected automatically</p>

          {/* Countdown Display */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {count}
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Second{count !== 1 ? 's' : ''}</div>
              <div className="text-gray-400 text-sm">Remaining</div>
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-1 mb-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
            <div
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((3 - count) / 3) * 100}%` }}
            />
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-6">
            <FaShieldAlt className="text-green-400" />
            <span>Secure Connection • Encrypted Redirect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;