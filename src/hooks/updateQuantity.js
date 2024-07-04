import { useRecoilState } from "recoil";
import cartState from "../recoil/atoms/cart";
import axios from "axios";
import { toast } from "react-toastify";

const useUpdateQuantity = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const updateQuantity = async (quantity, productName, flag) => {
    // flag ? (quantity = quantity + 1) : (quantity = quantity - 1);
    // console.log(quantity, productName, flag);
    try {
      const {
        data: { updatedCart },
      } = await axios.post(
        "http://localhost:3000/cart/updateQuantity",
        {
          updateQuantity: quantity,
          productName: productName,
          user: sessionStorage.getItem("user"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (updatedCart) {
        setCart(updatedCart.cart);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data, {
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
  return { cart, updateQuantity };
};

export default useUpdateQuantity;
