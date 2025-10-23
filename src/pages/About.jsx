import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <img
                src="/images/about.jpeg"
                alt="about us"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
            
            {/* Content Section */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
                <p className="text-gray-600 leading-relaxed text-justify">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                  officiis obcaecati esse tempore unde ratione, eveniet mollitia,
                  perferendis eius temporibus dicta blanditiis doloremque explicabo
                  quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
                  accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
                  commodi illum quidem neque tempora nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;