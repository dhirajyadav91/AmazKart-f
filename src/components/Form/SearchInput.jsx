import React, { useState } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
      setIsExpanded(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Mobile View */}
      <div className="md:hidden">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        ) : (
          <form
            className="flex gap-2 animate-fade-in"
            role="search"
            onSubmit={handleSubmit}
          >
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              type="search"
              placeholder="Search..."
              autoFocus
              value={values.keyword}
              onChange={(e) => setValues({ ...values, keyword: e.target.value })}
            />
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
              type="submit"
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Desktop View */}
      <form
        className="hidden md:flex gap-2"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          type="search"
          placeholder="Search products..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;