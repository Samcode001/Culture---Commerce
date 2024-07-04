import { useRecoilState } from "recoil";
import cartState from "../recoil/atoms/cart";
import axios from "axios";

const useGetCart = () => {
  const [cart, setCart] = useRecoilState(cartState);

  const getCart = async () => {
    const {
      data: { cartItems },
    } = await axios.post(
      "http://localhost:3000/cart/getItems",
      {
      user:   sessionStorage.getItem("user")
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (cartItems) {
      setCart(cartItems);
    }
  };

  return { cart, getCart };
};

export default useGetCart;
