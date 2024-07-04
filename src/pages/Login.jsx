import React, { useState } from "react";
import "../styles/Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useHandleUser from "../hooks/handleUser";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "demo@gmail.com",
    password: "demo@1234",
  });

  const { getUser } = useHandleUser();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUser = async () => {
    await getUser();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        // "http://localhost:3000/admin/login",
        formData
      );

      if (response.data.success) {
        handleUser();
        navigate("/");
        window.location.reload(true);
        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message, {
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
      // Redirect or handle success as needed
    } catch (error) {
      // console.error("Signup error:", error.response.data);
      // Handle error (e.g., display error message)
      toast.error(error.response.data.message, {
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
  return (
    <div className="signup-container">
      <h1 style={{ fontSize: "clamp(0.8rem,3vw,2.3rem)" }}>
        Login to Access all Features.
      </h1>
      <div className="form-container">
        <h2 className="form-heading">Login</h2>
        <label className="label">
          Email:
          <input
            className="input"
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label className="label">
          Password:
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button
          style={{ marginBottom: "1rem" }}
          className="button"
          type="submit"
          onClick={handleSubmit}
        >
          Login
        </button>
        <br />
        <hr />
        <Link to={"/signup"} style={{ textDecoration: "none" }}>
          <h2 style={{ margin: "1rem 0rem" }}>Create New Account</h2>
        </Link>
      </div>
    </div>
  );
};

export default Login;
