import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import { useAuth } from "../../context/auth"; // Add auth context

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth(); // Add auth for authorization

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/category/create-category`, 
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Add authorization
          },
        }
      );
      
      if (data?.success) {
        toast.success(`${name} category created successfully`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to create category");
      }
    } catch (error) {
      console.log("Create category error:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login as admin");
      } else {
        toast.error("Something went wrong while creating category");
      }
    } finally {
      setLoading(false);
    }
  };

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log("Get categories error:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!updatedName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName.trim() },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Add authorization
          },
        }
      );
      
      if (data?.success) {
        toast.success(`${updatedName} category updated successfully`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.log("Update category error:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login as admin");
      } else {
        toast.error("Something went wrong while updating category");
      }
    } finally {
      setLoading(false);
    }
  };

  //delete category
  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/category/delete-category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Add authorization
          },
        }
      );
      
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.log("Delete category error:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login as admin");
      } else if (error.response?.status === 400) {
        toast.error("Cannot delete category with associated products");
      } else {
        toast.error("Something went wrong while deleting category");
      }
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <AdminMenu />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Categories</h1>
            
            {/* Category Form */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Category</h2>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
                loading={loading}
                buttonText="Create Category"
                placeholder="Enter category name"
              />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Existing Categories ({categories.length})
                  </h2>
                  <button
                    onClick={getAllCategory}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories?.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(category.name);
                                setSelected(category);
                              }}
                              disabled={loading}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDelete(category._id)}
                              disabled={loading}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {categories?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📂</div>
                  <p className="text-gray-500 text-lg">No categories found.</p>
                  <p className="text-gray-400">Create your first category above.</p>
                </div>
              )}
            </div>

            {/* Edit Modal */}
            <Modal
              onCancel={() => {
                setVisible(false);
                setSelected(null);
                setUpdatedName("");
              }}
              footer={null}
              open={visible}
              title={
                <div className="flex items-center gap-2">
                  <span>✏️</span>
                  <span>Edit Category</span>
                </div>
              }
              width={500}
            >
              <div className="p-4">
                <CategoryForm
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                  loading={loading}
                  buttonText="Update Category"
                  placeholder="Enter updated category name"
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;