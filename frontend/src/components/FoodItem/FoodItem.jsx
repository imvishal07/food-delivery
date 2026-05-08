import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { buildImageUrl } from "../../config/api";

const FoodItem = ({ image, name, price, desc, id }) => {
  const { cartItems, addToCart, removeFromCart, currency } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      
      {/* IMAGE */}
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={buildImageUrl(image)}
          alt={name}
        />

        {/* ADD BUTTON */}
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
              alt="remove"
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={() => addToCart(id)}
              alt="add"
            />
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="food-item-info">
        <p className="food-item-name">{name}</p>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">
          {currency}{price}
        </p>
      </div>

    </div>
  );
};

export default FoodItem;