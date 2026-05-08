import React, { useEffect, useState } from "react";
import "./ExploreMenu.css";
import { api, buildImageUrl } from "../../config/api";

const ExploreMenu = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/list");
        setCategories(
          Array.isArray(response.data?.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>

      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes.
        Our mission is to satisfy your cravings and elevate your dining
        experience, one delicious meal at a time.
      </p>

      <div className="explore-menu-list">
        {categories.map((item) => (
          <div
            key={item._id}
            className={`explore-menu-list-item ${
              category === item.name ? "selected" : ""
            }`}
            onClick={() =>
              setCategory((prev) =>
                prev === item.name ? "All" : item.name
              )
            }
          >
            <img
              src={buildImageUrl(item.image)}
              alt={item.name}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;