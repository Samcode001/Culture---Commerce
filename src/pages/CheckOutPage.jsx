import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect, useState } from "react";
import "../styles/CheckOut.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import cartState from "../recoil/atoms/cart";
import Navbar from "../components/Navbar";
import useAddToCart from "../hooks/addToCart";
import useGetCart from "../hooks/getCart";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { loadStripe } from "@stripe/stripe-js";
import logoImage from "../assets/images (1).jpg";
import { useNavigate } from "react-router-dom";

const CheckOutPage = () => {
  /// ***********************------------ State for Adding  Address ------------- ****************************8
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeAddress, setPincodeAddress] = useState("");
  const [addressFlag, setAddressFlag] = useState(false);
  //   the operator '?.' is called optional chaining operator
  //   selectedCountry?.isoCode
  //   const isoCode=selectedCountry ? selectedCountry.isoCode : undefined ;

  /// *******************---------- states for checkout page --------------**************************

  const [userAddress, setUserAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [subTotal, setSubTotal] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [phone, setPhone] = useState("");
  const { cart, getCart } = useGetCart();
  const setCart = useSetRecoilState(cartState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deliveryAddress = {
      name: firstName + " " + lastName,
      address: address,
      City: selectedCity.name,
      State: selectedState.name,
      Country: selectedCountry.name,
      Pincode: pincode,
    };

    const {
      data: { success, message },
    } = await axios.post(
      "http://localhost:3000/admin/address",
      {
        address: deliveryAddress,
        user: sessionStorage.getItem("user"),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (success) {
      setAddressFlag(true);
      getAddress();
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setFirstName("");
      setLastName("");
      setAddress("");
      setPincode("");
      let tempSum = cart.reduce((accumulator, item) => {
        return (
          accumulator + parseFloat(item.price.replace(/,/g, "")) * item.quantity
        );
      }, 0);

      console.log("Subtotal Before:", tempSum); // Log the subtotal before calculation

      setSubTotal(tempSum);
      tempSum += tempSum * 0.08;

      setTotalSum(tempSum);
    }
  };

  const handlePincode = async (e) => {
    setPincode(e.target.value);
    const { data } = await axios.get(
      `https://api.postalpincode.in/pincode/${e.target.value}`
    );
    if (data[0].Status === "Success") {
      let postOffice = data[0].PostOffice[0];
      setPincodeAddress(
        postOffice.Name +
          " " +
          postOffice.Region +
          " " +
          postOffice.State +
          " " +
          postOffice.Country +
          " " +
          postOffice.Pincode
      );
      // console.log(data);
      // console.log(postOffice)
    }
  };

  const getAddress = async () => {
    const {
      data: { success, message, address },
    } = await axios.get(
      "http://localhost:3000/admin/address",
      {
        headers: {
          Authorization: "bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (success) {
      setAddressFlag(true);
      setUserAddress(address);
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
    }
  };

  const handleSelectAddress = (elem) => {
    setSelectedAddress(elem);
  };

  useEffect(() => {
    Promise.all([getCart(), getAddress()])
      .then(() => {
        // let tempSum = cart.reduce((accumulator, item) => {
        //   return accumulator + item.price * item.quantity;
        // }, 0);
        // setSubTotal(tempSum);
        // tempSum += tempSum * 0.08;
        // setTotalSum(tempSum);
        // console.log("Calc")

        // console.log("Cart:", cart); // Log the cart state
        // console.log("User Address:", userAddress); // Log the userAddress state

        let tempSum = cart.reduce((accumulator, item) => {
          return (
            accumulator +
            parseFloat(item.price.replace(/,/g, "")) * item.quantity
          );
        }, 0);

        console.log("Subtotal Before:", tempSum); // Log the subtotal before calculation

        setSubTotal(tempSum);
        tempSum += tempSum * 0.08;

        setTotalSum(tempSum);
        // console.log("Subtotal After:", tempSum); // Log the subtotal after calculation
        // console.log("Calc");
      })
      .catch((err) => console.log(err));
  }, []);

  // ------------------------ Payments functionalities ----------------------------

  const paymentsOptions = [
    // {
    //   value: "Stripe",
    //   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    // },
    {
      value: "Razorpay",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png",
    },
    {
      value: "COD",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY-n0bQFbk-Rx0bMmhiwUvDQkZ6o1ymrWRPg&usqp=CAU",
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState("");
  const navigate = useNavigate();

  const handleSelectPayment = (elem) => {
    setSelectedPayment(elem);
  };

  const razorPayment = async (amount) => {
    const {
      data: { key },
    } = await axios.get("http://localhost:3000/getRazorkey", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const {
      data: { order, success },
    } = await axios.post(
      "http://localhost:3000/payments/checkout",
      {
        amount,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (!success) {
      return toast.error(data.error, {
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
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Culture & Commerce",
      description: "Test Transaction",
      image: logoImage,
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url: "http://localhost:3000/payments/paymentVerification",
      handler: async function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        // const { data: success } = await axios.post(
        //   "http://localhost:3000/payments/paymentVerification",
        //   { response },
        //   {
        //     headers: {
        //       Authorization: "bearer " + localStorage.getItem("token"),
        //     },
        //   }
        // );
        if (response) {
          const {
            data: { success },
          } = await axios.post(
            "http://localhost:3000/orders/order",
            {
              order: cart,
              total: totalSum,
              user: sessionStorage.getItem("user"),
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );

          if (success) {
            toast.success("Payment Succesful", {
              position: "bottom-left",
              autoClose: 1800,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(async () => {
              setCart([]);

              const {
                data: { success },
              } = await axios.post(
                "http://localhost:3000/cart/clear",
                {
                  user: sessionStorage.getItem("user"),
                },
                {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              );
              if (success) {
                navigate("/paymentsuccess");
              }
            }, 2000);
          }
        } else {
          toast.error("Payment Failed", {
            position: "bottom-left",
            autoClose: 1800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#000000",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const stripePayment = async () => {
    const {
      data: { key },
    } = await axios.get("http://localhost:3000/getStripekey", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const stripe = await loadStripe(key);

    const { data } = await axios.post(
      "http://localhost:3000/payments/stripePayment",
      {
        products: cart,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    // const session = await response.json();

    // if (data.success) {
    //   const checkStatus = async () => {
    //     const updatePaymentIntent = await stripe.retrievePaymentIntent(data.id);

    //     if (updatePaymentIntent.status  === "succeeded") {
    //       alert(`Payment succeeded:${updatePaymentIntent}`);
    //       // alert("Payemtn Done");
    //     } else {
    //       // alert("payment Failed");
    //       alert(`Payment Failed:${updatePaymentIntent.status}`);
    //       setTimeout(checkStatus, 1000);
    //     }
    //   };

    //   checkStatus();
    // }

    const result = stripe.redirectToCheckout({
      sessionId: data.id,
    });

    if (result.error) {
      console.log(result.error);
    } else {
      setCart([]);
    }
  };

  const selectPaymentMethod = () => {
    if (!selectedAddress) {
      return toast.error("Please Select the Address", {
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

    if (phone === "") {
      return toast.error("Enter contact no.", {
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

    // const OrderDeatil={
    //   name:
    // }
    // return console.log(phone, selectedAddress, totalSum);

    switch (selectedPayment) {
      case "Stripe":
        // return console.log("Stripe payment selected");
        return stripePayment();
      case "Razorpay":
        // return console.log("Razorpay payment selected");
        return razorPayment(totalSum);
      case "COD":
        navigate("/paymentsuccess");
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {addressFlag ? (
        <>
          <div className="checkout-container">
            <div className="checkout-left">
              <div className="checkout-contact">
                <label htmlFor="contact">Contact</label>
                <PhoneInput
                  country={"in"}
                  enableSearch={true}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  className="checkout-phone"
                />
              </div>
              <div
                className="checkout-address"
                style={{ backgroundColor: "rgb(217, 214, 214)" }}
              >
                <h2>Address</h2>
                <div style={{ overflowY: "scroll", marginBottom: "0.6rem" }}>
                  {userAddress &&
                    userAddress.map((elem, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => handleSelectAddress(elem)}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            id={index}
                            name="selectAddress"
                            style={{ display: "inline" }}
                            checked={elem === selectedAddress}
                            type="radio"
                            onChange={() => {}}
                          />
                          <label htmlFor="selectAddress">{elem}</label>
                        </div>
                      );
                    })}
                  {/* <input type="radio" /> <p>{userAddress}</p> */}
                </div>
                <button
                  className="button-buy"
                  onClick={() => setAddressFlag(false)}
                >
                  Add new Address..
                </button>
              </div>
              <div className="checkout-payment-options">
                <h2>Payment</h2>
                <div>
                  {paymentsOptions.map((elem, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectPayment(elem.value)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          gap: "1rem",
                          margin: "1rem 0",
                        }}
                        // className="payment-item"
                      >
                        <input
                          id={elem.value}
                          name="selectPayment"
                          style={{ display: "inline" }}
                          checked={elem.value === selectedPayment}
                          type="radio"
                          onChange={() => {}}
                        />
                        <label htmlFor="selectAddress">
                          {" "}
                          <img
                            src={elem.img}
                            alt={elem.value}
                            width={120}
                            height={40}
                          />
                        </label>
                      </div>
                    );
                  })}
                  {/* <button onClick={stripePayment}>Stripe</button> */}
                </div>
              </div>
              <button className="button" onClick={selectPaymentMethod}>
                Order Now
              </button>
            </div>
            <div className="checkout-right">
              <div>
                <div className="checkout-right-container">
                  <div className="checkout-right-products">
                    {cart &&
                      cart.map((elem) => {
                        return (
                          <div key={elem._id} className="checkout-right-items">
                            <div style={{ position: "relative" }}>
                              <img src={elem.img} alt="" />
                              <span className="checkout-right-quantity">
                                {elem.quantity}
                              </span>
                            </div>
                            <div className="checkout-right-items-details">
                              <h3>{elem.name}</h3>
                              <span>
                                {elem.type}/{elem.memory}/{elem.os}
                              </span>
                            </div>
                            <h2>₹ {elem.price}</h2>
                          </div>
                        );
                      })}
                  </div>
                  <div>
                    <div>
                      <h3>Subtotal</h3> <h2>₹ {subTotal}.00</h2>
                    </div>
                    <div>
                      <h3> Shipping </h3>{" "}
                      <p style={{ maxWidth: "25ch" }}>
                        {" "}
                        {selectedAddress
                          ? selectedAddress
                          : "Please Select the address"}
                      </p>
                    </div>
                    <div>
                      <h3>
                        Estimated taxes
                        {/* <span>&#63;</span> */}
                      </h3>
                      <h2>₹ {parseInt(subTotal * 0.08)}.00</h2>
                    </div>
                    <div>
                      <h2> Total</h2>{" "}
                      <h2>
                        <span
                          style={{ fontWeight: "100", fontSize: "1rem" }}
                        ></span>{" "}
                        ₹ {parseInt(totalSum)}.00
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={addressFlag ? { display: "none" } : { display: "block" }}
            className="address-overlay-container"
          >
            <div className="address-modal">
              <div className="address-modal-banner">Enter Delevery Address</div>
              <IoClose
                size={45}
                onClick={() => setAddressFlag((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 999999,
                  cursor: "pointer",
                }}
                color="red"
              />
              <form>
                <div
                  className="adrress-name-section"
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <input
                    type="text"
                    placeholder="Firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Select
                  options={Country.getAllCountries()}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={selectedCountry}
                  onChange={(item) => {
                    setSelectedCountry(item);
                  }}
                  className="address-select"
                  placeholder="Country/Region"
                />

                <div>
                  <Select
                    options={State?.getStatesOfCountry(
                      selectedCountry?.isoCode
                    )} // if the country is selceted then the options of state will render in its positions otherwise the value of state will be undefined
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedState}
                    onChange={(item) => {
                      setSelectedState(item);
                    }}
                    className="address-select"
                    placeholder="State"
                  />
                  <Select
                    options={City.getCitiesOfState(
                      selectedState?.countryCode,
                      selectedState?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCity}
                    onChange={(item) => {
                      setSelectedCity(item);
                    }}
                    className="address-select"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={handlePincode}
                  />
                  <span
                    style={{ color: "red", fontSize: "1rem", display: "block" }}
                  >
                    {pincodeAddress && pincodeAddress}
                  </span>
                  {/* <span>{console.log(pincodeAddress)}</span> */}
                </div>
                <button type="submit" onClick={handleSubmit} className="button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOutPage;
