import { useRecoilState } from "recoil";
import wishListState from "../recoil/atoms/wishList";
import axios from "axios";
import { toast } from "react-toastify";

const useHanldeList = () => {
  const [wishList, setWishList] = useRecoilState(wishListState);

  const addToList = async (productData) => {
    const {
      data: { success, message },
    } = await axios.post(
      "http://localhost:3000/wishlist/addItem",
      {
        name: productData.name,
        img: productData.images[0],
        os: productData.os,
        type: productData.type,
        memory: productData.memory,
        price: productData.price,
      user:   sessionStorage.getItem("user")
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (success) {
      setWishList((prevCart) => [...prevCart, productData]);
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

  const getWishList = async () => {
    const {
      data: { wishListItems },
    } = await axios.post(
      "http://localhost:3000/wishlist/getItems",
      {
        user:   sessionStorage.getItem("user")
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (wishListItems) {
      setWishList(wishListItems);
    }
  };

  const removeToList = async (itemName, flag = true) => {
    const res = await axios.post(
      "http://localhost:3000/wishlist/removeItem",
      {
        name: itemName,
        user:   sessionStorage.getItem("user")
      },
      {
        headers: {
          Authorization: "bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 201 && flag) {
      toast.error("Item Removed", {
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
    setWishList((prevCart) =>
      prevCart.filter((elem) => elem.name !== itemName)
    );
  };

  return { wishList, addToList, removeToList, getWishList };
};

export default useHanldeList;
