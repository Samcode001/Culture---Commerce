import React, { useEffect, useState } from "react";
import "../styles/UserProfilePage.css";
import useHandleUser from "../hooks/handleUser.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user.js";

const UserProfilePage = () => {
  // const { getUser } = useHandleUser();

  const [selectedOptions, setSelectedOptions] = useState("details");
  // const user = useRecoilValue(userState);

  const navigate = useNavigate();

  // const getUser = async () => {
  //   const { data } = await axios.post(
  //     "http://localhost:3000/admin/getUser",
  //     {},
  //     {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     }
  //   );
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(true);
  };

  const handleProfile = () => {
    switch (selectedOptions) {
      case "orders":
        return <ProfileOrders />;

        break;
      case "address":
        return <ProfileAddress />;
        break;
      case "details":
        return <ProfileDeatils />;
      default:
        return null;
        break;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-user-info"></div>
        <ul className="profile-sidebar-options">
          <li onClick={() => setSelectedOptions("details")}>Details</li>
          <li onClick={() => setSelectedOptions("orders")}>My Orders</li>
          <li onClick={() => setSelectedOptions("address")}>Saved Addresses</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className="profile-main-content">{handleProfile()}</div>
    </div>
  );
};

export default UserProfilePage;

const ProfileDeatils = () => {
  const { user, getUser } = useHandleUser();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="profile-user-details">
        <img src={user.avatar?.url} alt="User Avatar" />
        <h1>{user.name}</h1>
      </div>
    </>
  );
};

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/orders/order",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      setOrders(data.orders.orders);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <div className="profile-previous-orders">
        <div>
          <h2 style={{ fontSize: "3rem", fontWeight: "600" }}>User Orders</h2>
          <ul className="previous-orders-container">
            {orders.length !== 0
              ? orders.map((order) => (
                  <div key={order.id} className="previous-orders-items">
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: "300",
                        color: "gray",
                      }}
                    >
                      Order Id:{order.orderId}
                    </p>
                    <ul className="previos-orders-images">
                      {order.order.length > 1 ? (
                        order.order.slice(0, 5).map((elem, index) => {
                          return (
                            <li key={index}>
                              <a href="#">
                                <img src={elem.img} alt="" />
                              </a>
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <a href="#">
                            <img src={order.order.images[0]} alt="" />
                          </a>
                        </li>
                      )}
                    </ul>
                    <p>
                      <strong style={{ color: "red" }}>Total:</strong> Rs.
                      {parseInt(order.total)}
                    </p>
                  </div>
                ))
              : "No Orders"}
          </ul>
        </div>
      </div>
    </>
  );
};

const ProfileAddress = () => {
  const [userAddress, setUserAddress] = useState([]);

  const getAddress = async () => {
    const {
      data: { success, address },
    } = await axios.post(
      "http://localhost:3000/admin/address",
      {
        user: sessionStorage.getItem("user"),
      },
      {
        headers: {
          Authorization: "bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (success) {
      setUserAddress(address);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <div className="profile-saved-addresses">
        <h3 style={{ fontSize: "2rem", fontWeight: "550" }}>Address</h3>
        {userAddress &&
          userAddress.map((elem, index) => {
            return (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  marginBlock: "1rem",
                  backgroundColor: "rgb(217, 214, 214)",
                }}
              >
                <label htmlFor="selectAddress">{elem}</label>
              </div>
            );
          })}
      </div>
    </>
  );
};
