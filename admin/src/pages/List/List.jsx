import React, { useEffect, useState } from "react";
import "./List.css"; // ✅ IMPORTANT
import { api, buildImageUrl } from "../../config/api";

const List = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    const res = await api.get("/api/food/list");
    setList(res.data.data);
  };

  const removeFood = async (id) => {
    await api.post("/api/food/remove", { id });
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🧾 TABLE HEADER */}
      <div className="list-table-format title">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>

      {/* 📦 LIST */}
      {filteredList.map((item) => (
        <div key={item._id} className="list-table-format">
          <img src={buildImageUrl(item.image)} alt="" />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>₹{item.price}</p>
          <p onClick={() => removeFood(item._id)} style={{ cursor: "pointer" }}>
            ❌
          </p>
        </div>
      ))}

    </div>
  );
};

export default List;