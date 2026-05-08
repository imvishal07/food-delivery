import React, { useEffect, useState } from "react";
import { api, buildImageUrl } from "../../config/api";

const PopularFoods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api.get("/api/food/list");

        if (response.data?.success) {
          setFoods(response.data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular foods:", error);
        setFoods([]);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div style={{ padding: "60px 8vw" }}>
      <h2 style={{ marginBottom: "30px" }}>Popular Dishes</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        {foods.map((item) => (
          <div
            key={item._id}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={buildImageUrl(item.image)}
              alt={item.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />

            <h3 style={{ marginTop: "10px" }}>{item.name}</h3>
            <p style={{ color: "#ff4c24" }}>Rs.{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularFoods;
