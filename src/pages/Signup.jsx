import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import axios from "axios";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAvatar = async (e) => {
    try {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 0.05, // Max size in megabytes
        maxWidthOrHeight: 500, // Max width or height of the image
        useWebWorker: true, // Use web worker for faster compression
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("file", avatar);
      const res = await axios.post(
        "http://localhost:3000/admin/signup",
        {
          name,
          username,
          password,
          avatar,
        }
      );
     
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
        window.location.reload(true);
      } else {
        toast.error(res.data.message, {
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
      // console.error("Signup error:", error.response.data.message);
      // Handle error (e.g., display error message)
    }
  };
  return (
    <div className="signup-container">
      <div className="form-container">
        <h2 className="form-heading">Signup</h2>
        <label className="label">
          Name
          <input
            className="input"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="label">
          Email:
          <input
            className="input"
            type="email"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="label" style={{ position: "relative" }}>
          Password:
          <span
            style={{
              fontSize: "0.8rem",
              color: "gray",
              height: "fit-content",
              // outline: "1px solid gray",
              position: "absolute",
              right: "0",
            }}
          >
            Password must be 8 characters long.
          </span>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div style={{ marginBlock: "1rem" }}>
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              style={{ width: "40px", height: "40px", borderRadius: "100vmax" }}
            />
          ) : (
            <RxAvatar size={30} />
          )}
          <span>
            Upload a File{" "}
            <span
              style={{
                fontSize: "0.8rem",
                color: "gray",
                height: "fit-content",
              }}
            >
              Support's ".jpg,.png.jpeg" only.
            </span>
          </span>
          <input
            type="file"
            name="avatar"
            id="user-input"
            accept=".jpg,.jpeg,.png"
            onChange={handleAvatar}
          />
        </div>
        <button className="button" type="submit" onClick={handleSubmit}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
