import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import "../styles/ProductsCard.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";
import useAddToCart from "../hooks/addToCart";

import useAddToList from "../hooks/addToList";
import useGetCart from "../hooks/getCart";
import useHanldeList from "../hooks/addToList";
import GeneraetStars from "./GeneraetStars";

const ProductCard = ({ data, onClick }) => {
  const [click, setClick] = useState(false);
  const [totalRatings, setTotalRatings] = useState(0);
  // const [open, setOpen] = useState(false);
  // const [cart, setCart] = useRecoilState(cartState);
  // const [wishlist, setWishList] = useRecoilState(wishListState);

  const { addToCart } = useAddToCart();
  const { addToList, removeToList, getWishList } = useHanldeList();
  const { getCart } = useGetCart();

  const user = localStorage.getItem("user");

  const id = data._id;

  const navigate = useNavigate();

  const handleCart = async () => {
    // if (user) {
    // } else navigate("/login");
    await addToCart(data);
    getCart();
  };

  const hanldeWishList = async () => {
    // if (user) {
    // } else navigate("/login");
    await addToList(data);
    getWishList();
  };

  const deleteListItem = async () => {
    // if (user) {
    // } else navigate("/login");
    await removeToList(data.name);
    // console.log("Delete Ahppened");
  };

  // for setting the ratings of the products
  const getRatings = async () => {
    const res = await axios.post(
      "http://localhost:3000/data/ratings",
      {
        id: id,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 200) {
      // setRatings(res.data.ratings);

      const ratingsData = res.data.ratings;
      let averageRating = 0;
      for (let i = 0; i < ratingsData.length; i++) {
        averageRating += ratingsData[i].rate;
      }
      averageRating = Math.ceil(averageRating / ratingsData.length);
      setTotalRatings(averageRating);
    }
  };

  useEffect(() => {
    getRatings();
  }, []);

  //   const product_name = d.replace(/\s+/g, "-"); // This product_name will be used in url for redirecting to product page so we need to change the all the ' ' spaces ("\s+") in the product name (d=data.name) to hyphens "-", so the product_name can be URL Friendly String

  return (
    <div className="card-container">
      <div onClick={onClick}>
        <Link to={`/product/${id}`}>
          <img src={data.images[0]} alt="" className="card-image" />
        </Link>
      </div>
      {/* <Link to={"/"}>{data.shop.name}</Link> */}
      <div>
        <Link to={`/product/${id}`} className="card-details">
          <h4 style={{ fontSize: "1.2rem" }}>
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="stars">
            {<GeneraetStars rating={totalRatings} size={20} />}
          </div>

          <div>
            <div>{/* <h4>{data.price ? data.price + "$" : null}</h4> */}</div>
            <h5 style={{ marginBottom: "0.4rem" }}>₹ {data.price}</h5>
            <span style={{ fontSize: "clamp(0.8rem,2vw,1rem)", color: "gray" }}>
              {data.os} / {data.memory}
            </span>
          </div>
        </Link>
      </div>

      {/* side options */}
      <div className="side-options">
        {click ? (
          <AiFillHeart
            size={22}
            onClick={() => {
              setClick(!click);
              deleteListItem();
            }}
            color={click ? "red" : "#333"}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            onClick={() => {
              setClick(!click);
              hanldeWishList();
            }}
            color={click ? "red" : "#333"}
            title="Add to wishlist"
          />
        )}
      </div>

      <div className="buttons">
        <button
          className="button card-button"
          // style={{fontSize:"clamp(1rem,2vw,1.2rem)"}}
          onClick={handleCart}
        >
          Add Cart
        </button>
        <button
          className="button-buy"
          onClick={() => {
            if (user) navigate(`/buy/${id}`);
            else navigate("/login");
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
