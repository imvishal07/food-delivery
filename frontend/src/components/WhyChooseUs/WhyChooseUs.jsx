import React from "react";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  return (
    <div className="why">
      <h2>Why Choose QuickBite?</h2>
      <p className="why-subtitle">
        We bring delicious meals to your doorstep with speed, quality, and care.
      </p>

      <div className="why-container">

        <div className="why-card">
          <h3>🚀 Fast Delivery</h3>
          <p>Get your favorite meals delivered quickly and fresh.</p>
        </div>

        <div className="why-card">
          <h3>🥗 Fresh Ingredients</h3>
          <p>We use only fresh and high-quality ingredients.</p>
        </div>

        <div className="why-card">
          <h3>⭐ Best Quality</h3>
          <p>Enjoy restaurant-quality meals every time you order.</p>
        </div>

        <div className="why-card">
          <h3>🔒 Secure Payment</h3>
          <p>Safe and reliable payment options for a smooth experience.</p>
        </div>

      </div>
    </div>
  );
};

export default WhyChooseUs;