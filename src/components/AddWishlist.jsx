import React, { useEffect, useRef, useState } from "react";
import "../styles/AddCart.css";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import wishListState from "../recoil/atoms/wishList";
import useHanldeList from "../hooks/addToList";
import useAddToCart from "../hooks/addToCart";
import { allPhonesDataState } from "../recoil/atoms/data";
import useGetCart from "../hooks/getCart";

const AddWishlist = ({ wishlistFlag, setWishlistFlag }) => {
  const [count, setCount] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [quantityPrice, setQuantityPrice] = useState(0);
  const [wishlist, setWishList] = useRecoilState(wishListState);
  const { addToCart } = useAddToCart();
  const { getCart } = useGetCart();
  const { getWishList } = useHanldeList();
  const allPhones = useRecoilValue(allPhonesDataState);
  const { removeToList } = useHanldeList();

  const wishListRef = useRef();

  const handleClickOutside = (event) => {
    if (wishListRef.current && !wishListRef.current.contains(event.target)) {
      setWishlistFlag(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteListItem = async (itemName) => {
    await removeToList(itemName);
  };

  const handlecart = async (data) => {
    const phone = allPhones.find((elem) => elem.name === data.name);
    await addToCart(phone);
    getCart();
    await removeToList(data.name, false);
  };

  // useEffect(() => {
  //   let total = 0;
  //   for (let i = 0; i < wishlist.length; i++) {
  //     total += wishlist[i].price;
  //   }
  //   setSubTotal(total);
  // }, [wishlist]);

  return (
    <div
      className="cart-container"
      style={
        wishlistFlag
          ? { right: "0rem", opacity: "1" }
          : { right: "-100rem", opacity: "0" }
      }
      ref={wishListRef}
    >
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "550" }}>Your WishList</h2>
        <IoClose
          style={{ cursor: "pointer" }}
          size={27}
          color="black"
          onClick={() => setWishlistFlag((prevFlag) => !prevFlag)}
        />
      </div>

      <div className="cart-content">
        {wishlist.length === 0 ? (
          <h2 style={{ fontSize: "2rem", fontWeight: "550", color: "red" }}>
            List empty
          </h2>
        ) : (
          wishlist &&
          wishlist.map((elem) => {
            return (
              <>
                <div className="cart-item">
                  <hr />
                  <div className="cart-details-container">
                    <img src={elem.img} alt="" className="cart-details-image" />
                    <div className="cart-details">
                      <h2>{elem.name}</h2>
                      {/* <span>Type: {elem.type}</span> */}
                      <span>Place: {elem.os},</span>
                      <span>Qty: {elem.memory},</span>
                      <h2>₹ {elem.price}</h2>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <button
                        className="button"
                        onClick={() => handlecart(elem)}
                      >
                        Add to cart
                      </button>
                    </div>
                    <RiDeleteBin5Fill
                      style={{ cursor: "pointer" }}
                      size={32}
                      className="remove-button-cart"
                      onClick={() => deleteListItem(elem.name)}
                    />
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>

      <hr />
      <div className="cart-footer">
        <p
          style={{
            fontSize: "1.4rem",
            fontWeight: "550",
            paddingBlock: "1rem",
          }}
        >
          Save your favorites for later – because good things are worth waiting
          for!
        </p>
      </div>
    </div>
  );
};

export default AddWishlist;
