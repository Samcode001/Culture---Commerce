import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ProductDetails from "../components/ProductDetails.jsx";
import Footer from "../components/Footer.jsx";
import { allPhonesDataState } from "../recoil/atoms/data.js";
import axios from "axios";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [phones, setPhones] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/data/phones", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200) {
        setPhones(res.data.phones);
      } else {
        console.log("Some Erro occ");
      }
    } catch (error) {
      console.log(`Error in component :${error}`);
    }
  };

  const phone_data = phones.find((elem) => elem._id === id);

  useEffect(() => {
    getData();
    // console.log(phone_data);
    // console.log(phones);
    // console.log("hello")
  }, []);

  return (
    <div>
      {phone_data && <ProductDetails data={phone_data} />}
      {/* {phone_data && console.log(phone_data)} */}
    </div>
  );
};

export default ProductDetailsPage;
