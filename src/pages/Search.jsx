import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  return (
    <Layout title={"Search results"}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Results</h1>
          <h6 className="text-lg text-gray-600 mb-8">
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} product${values?.results.length !== 1 ? 's' : ''}`}
          </h6>
          <div className="flex flex-wrap justify-center -mx-2">
            {values?.results.map((p) => (
              <div 
                key={p._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="w-full h-48 object-cover"
                    alt={p.name}
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h5>
                    <p className="text-gray-600 text-sm mb-3">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="text-green-600 font-bold text-lg mb-4">$ {p.price}</p>
                    <div className="flex flex-col space-y-2">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-200">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;