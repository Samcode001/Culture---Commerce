import React, { useEffect } from "react";
import confirmationLogo from "../assets/icons8-approval.gif";
import { useLocation } from "react-router-dom";
import axios from "axios";

const OrderConfirmed = () => {
  const location = useLocation();

  //   const getConfirmation=async()=>{
  //     const res=await axios.post('hht')
  //   }

  //   useEffect(() => {
  //     const urlSearch = new URLSearchParams(location.search);
  //     const reference = urlSearch.get("reference");
  //   }, [location.search]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "3rem 2rem",
        }}
      >
        <img src={confirmationLogo} alt="" />
        <h1>Order Confirmed</h1>
        {/* <p>Reference:</p> */}
      </div>
    </div>
  );
};

export default OrderConfirmed;
