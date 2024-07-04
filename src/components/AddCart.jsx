import React, { useEffect, useRef, useState } from "react";
import "../styles/AddCart.css";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import cartState from "../recoil/atoms/cart";
// import cartState from "../recoil/atoms/cart";
import wishListState from "../recoil/atoms/wishList";
import useGetCart from "../hooks/getCart";
import { Link, useNavigate } from "react-router-dom";
import useAddToCart from "../hooks/addToCart";
import useUpdateQuantity from "../hooks/updateQuantity";
import useHanldeList from "../hooks/addToList";

const AddCart = ({ cartFlag, setCartFlag }) => {
  // const [quantitiy, setQuantity] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [quantityPrice, setQuantityPrice] = useState(0);
  const [cart, setCart] = useRecoilState(cartState);
  const { getCart } = useGetCart();
  const { updateQuantity } = useUpdateQuantity();

  const navigate = useNavigate();
  const cartRef = useRef();

  const user = localStorage.getItem("user");

  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setCartFlag(false);
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

  //  ----------------------- For Loading data into wishlist and cart ----------------------------

  const { getWishList } = useHanldeList();

  const deleteCartItem = async (itemName) => {
    const res = await axios.post(
      "http://localhost:3000/cart/removeItem",
      {
        name: itemName,
        user: sessionStorage.getItem("user"),
      },
      {
        headers: {
          Authorization: "bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (res === 201) {
      alert("Item deleted");
    }
    setCart((prevCart) => prevCart.filter((elem) => elem.name !== itemName));
  };

  const handleQuantity = async (quantity, productName, flag) => {
    await updateQuantity(quantity, productName), flag;
  };
  
  useEffect(() => {
    getCart();
    getWishList();
  }, []);

  // ------------------------------------- End --------------------------------------------

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += parseFloat(cart[i].price.replace(/,/g, "")) * cart[i].quantity;
    }
    setSubTotal(total);
  }, [cart]);

  // const setPrice = async () => {
  //   for (let i = 0; i < cart.length; i++) {
  //     if (cart[i]._id === itemId) {
  //       cart[i].price *= count;
  //     }
  //   }
  // };

  // useEffect(() => {}, [count]);

  return (
    <div
      className="cart-container"
      style={
        cartFlag
          ? { right: "0rem", opacity: "1" }
          : { right: "-100rem", opacity: "0" }
      }
      ref={cartRef}
    >
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "550" }}>Your Cart</h2>
        <IoClose
          style={{ cursor: "pointer" }}
          size={27}
          color="black"
          onClick={() => setCartFlag((prevFlag) => !prevFlag)}
        />
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <h2 style={{ fontSize: "2rem", fontWeight: "550", color: "red" }}>
            Cart empty
          </h2>
        ) : (
          cart &&
          cart.map((elem) => {
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
                      <h2>
                        ₹{" "}
                        {parseFloat(elem.price.replace(/,/g, "")) *
                          elem.quantity}
                      </h2>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    <div className="cart-quantitiy-container">
                      <FaPlus
                        style={{ cursor: "pointer" }}
                        size={15}
                        onClick={() => {
                          handleQuantity(elem.quantity + 1, elem.name, true);
                          // setPrice(elem._id);
                        }}
                      />
                      <span>{elem.quantity}</span>
                      <FaMinus
                        style={{ cursor: "pointer" }}
                        size={15}
                        onClick={() => {
                          handleQuantity(elem.quantity - 1, elem.name, false);
                          // setPrice(elem._id);
                        }}
                      />
                    </div>
                    <RiDeleteBin5Fill
                      style={{ cursor: "pointer" }}
                      size={30}
                      className="remove-button-cart"
                      onClick={() => deleteCartItem(elem.name)}
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
        <div>
          <h2>Subtotal</h2>
          <span>₹ {subTotal}.00</span>
        </div>
        <p>Taxes and shipping calculated at checkout</p>
        <button
          className="button"
          onClick={() => {
            setCartFlag((prevFlag) => !prevFlag);
            if (user) {
              navigate("/checkout");
            } else navigate("/login");
          }}
        >
          Check Out
        </button>
        {/* <Link to={"/checkout"}> */}
        {/* </Link> */}
      </div>
    </div>
  );
};

export default AddCart;
