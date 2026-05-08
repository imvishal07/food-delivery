import React, { useEffect, useState } from "react";
import "./Category.css";
import { api, buildImageUrl } from "../../config/api";

const Category = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [list, setList] = useState([]);

  // 🔥 FETCH
  const fetchList = async () => {
    try {
      const res = await api.get("/api/category/list");
      setList(res.data?.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch categories ❌");
    }
  };

  // 🔥 ADD CATEGORY
  const addCategory = async () => {
    if (!name || !image) {
      alert("Please enter name and select image ⚠️");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const res = await api.post("/api/category/add", formData);

      alert(res.data?.message || "Category Added Successfully ✅");

      setName("");
      setImage(null);
      fetchList();
    } catch (error) {
      console.log(error);
      alert("Error adding category ❌");
    }
  };

  // 🔥 DELETE CATEGORY
  const removeCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (!confirmDelete) return;

    try {
      const res = await api.post("/api/category/remove", { id });

      alert(res.data?.message || "Category Deleted ✅");

      fetchList();
    } catch (error) {
      console.log(error);
      alert("Error deleting category ❌");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="category-container">

      <h2 className="category-title">Category Management</h2>

      {/* 🔥 ADD SECTION */}
      <div className="category-add">
        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={addCategory}>Add Category</button>
      </div>

      {/* 🔥 LIST */}
      <div className="category-list">
        {list.length === 0 ? (
          <p>No categories found</p>
        ) : (
          list.map((c) => (
            <div className="category-item" key={c._id}>
              <div className="category-left">
                <img src={buildImageUrl(c.image)} alt={c.name} />
                <span>{c.name}</span>
              </div>

              <button
                className="delete-btn"
                onClick={() => removeCategory(c._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Category;