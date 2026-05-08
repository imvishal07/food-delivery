import React, { useState, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { api } from "../../config/api";

const Add = () => {
  const [image, setImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/category/list");
      if (response.data?.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!image) return setPreviewUrl("");
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) return toast.error("Image not selected");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await api.post("/api/food/add", formData);

      if (response.data?.success) {
        toast.success(response.data.message);
        setData({ name: "", description: "", price: "", category: "" });
        setImage(false);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error("Error adding item");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
<div className="add">
  <form className="flex-col" onSubmit={onSubmitHandler}>

    {/* IMAGE */}
    <div className="add-img-upload">
      <p>Upload Image</p>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {previewUrl && <img src={previewUrl} alt="preview" />}
    </div>

    {/* NAME */}
    <div className="add-product-name">
      <p>Product Name</p>
      <input
        name="name"
        value={data.name}
        onChange={onChangeHandler}
        placeholder="Type here"
      />
    </div>

    {/* DESCRIPTION */}
    <div className="add-product-description">
      <p>Description</p>
      <textarea
        name="description"
        value={data.description}
        onChange={onChangeHandler}
      />
    </div>

    {/* CATEGORY + PRICE */}
    <div className="add-category-price">
      <select
        name="category"
        value={data.category}
        onChange={onChangeHandler}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        name="price"
        value={data.price}
        onChange={onChangeHandler}
        placeholder="Price"
      />
    </div>

    {/* BUTTON */}
    <button type="submit" className="add-btn">
      ADD
    </button>

  </form>
</div>
  );
};

export default Add;