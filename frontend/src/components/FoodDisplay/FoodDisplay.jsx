import React, { useContext, useMemo } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category, search }) => {
  const { food_list } = useContext(StoreContext);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredFood = useMemo(() => {
    return food_list.filter((item) => {
      const matchesCategory = category === "All" || category === item.category;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [category, food_list, normalizedSearch]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {filteredFood.map((item) => (
          <FoodItem
            key={item._id}
            image={item.image}
            name={item.name}
            desc={item.description}
            price={item.price}
            id={item._id}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
