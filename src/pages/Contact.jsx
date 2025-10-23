import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto">
            {/* Left side image */}
            <div className="w-full lg:w-1/2">
              <img
                src="/images/contactus.jpeg"
                alt="contact us"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>

            {/* Right side content */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="bg-gray-800 text-white text-center py-3 px-4 rounded-lg text-2xl font-bold mb-6">
                  CONTACT US
                </h1>
                <p className="text-gray-600 leading-relaxed text-justify mb-6">
                  Any query and info about product? Feel free to call anytime, we are
                  available 24x7.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BiMailSend className="text-blue-500 text-xl" />
                    <span className="text-gray-700">AmazKart.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BiPhoneCall className="text-green-500 text-xl" />
                    <span className="text-gray-700">+91-9142607268</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BiSupport className="text-red-500 text-xl" />
                    <span className="text-gray-700">+91-9142607268 (toll free)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;