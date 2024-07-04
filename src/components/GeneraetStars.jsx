import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const GeneraetStars = ({ rating, size }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} color="orange" size={size} />
        ) : (
          <FaRegStar key={i} color="gray" size={size} />
        )
      );
    }
    return stars;
  };
  return <div style={{ display: "flex", gap: "5px" }}>{renderStars()}</div>;
};

export default GeneraetStars;
