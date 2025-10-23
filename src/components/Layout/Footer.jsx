import React from "react";
import { Link } from "react-router-dom";
import { 
  FaHeart, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter, 
  FaEnvelope,
  FaShieldAlt,
  FaPhoneAlt,
  FaUserCircle
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white pt-12 pb-8 px-4 border-t border-blue-500/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <span className="font-bold text-white text-lg">DY</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dhiraj Yadav
              </h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Full-stack developer passionate about creating innovative digital solutions. 
              Let's build something amazing together.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaLinkedin, href: "https://linkedin.com", color: "hover:text-blue-400" },
                { icon: FaGithub, href: "https://github.com", color: "hover:text-gray-300" },
                { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-blue-300" },
                { icon: FaEnvelope, href: "mailto:dhiraj@example.com", color: "hover:text-red-400" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg border border-gray-700 hover:border-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className={`text-lg text-gray-400 transition-colors ${social.color}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-300 flex items-center">
              <FaUserCircle className="mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About", path: "/about", icon: FaUserCircle },
                { name: "Contact", path: "/contact", icon: FaPhoneAlt },
                { name: "Privacy Policy", path: "/policy", icon: FaShieldAlt }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-2 group"
                  >
                    <link.icon className="mr-3 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-300">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="mr-3 text-blue-500" />
                <span>dhiraj@example.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhoneAlt className="mr-3 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-300 mr-2">
              © {currentYear} Dhiraj Yadav. All rights reserved.
            </span>
            <FaHeart className="text-red-500 mx-1 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">
              Cookie Policy
            </span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">
              Sitemap
            </span>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 border border-blue-400/30 z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;