import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();
  
  return (
    <Layout title={"All Categories"}>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Categories</h1>
          <p className="text-gray-600">Browse products by category</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((c) => (
            <div key={c._id} className="w-full">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group">
                <Link 
                  to={`/category/${c.slug}`} 
                  className="block w-full text-center py-8 px-6 group-hover:bg-blue-50 transition duration-200"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                    <span className="text-white font-bold text-xl">
                      {c.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition duration-200 mb-2">
                    {c.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Explore collection
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Found</h3>
            <p className="text-gray-500">Categories will appear here once added.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;