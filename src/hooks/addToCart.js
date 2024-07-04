import { useRecoilState } from "recoil";
import cartState from "../recoil/atoms/cart";
import axios from "axios";
import { toast } from "react-toastify";

const useAddToCart = () => {
  const [cart, setCart] = useRecoilState(cartState);

  const addToCart = async (productData, quantity = 1) => {
    console.log(productData);
    const {
      data: { success, message },
    } = await axios.post(
      "http://localhost:3000/cart/addItem",
      {
        name: productData.name,
        price: productData.price,
        img: productData.images[0],
        os: productData.os,
        type: productData.type,
        quantity: quantity,
        memory: productData.memory,
      user:   sessionStorage.getItem("user")
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (success) {
      setCart((prevCart) => [...prevCart, productData]);
      toast.success(message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return { addToCart, cart };
};

export default useAddToCart;
