import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Products from "./pages/Products";
import OrderConfirmed from "./pages/OrderConfirmed";
import UserProfilePage from "./pages/UserProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BuyPage from "./pages/BuyPage.jsx";
import CheckOutPage from "./pages/CheckOutPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./components/NotFound";
import Faq from "./pages/Faq.jsx";
import About from "./pages/About.jsx";
import Footer from "./components/Footer.jsx";
import Android from "./pages/Android.jsx";
import axios from "axios";
import avatar from "./assets/avatar.png";
import { useEffect } from "react";

function App() {
  const user = sessionStorage.getItem("user");

  if (!user) {
    sessionStorage.setItem("user", Date.now());
  }

  return (
    <>
      <RecoilRoot>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/android" element={<Android />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckOutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paymentsuccess"
              element={
                <OrderConfirmed />
                // <ProtectedRoute>
                // </ProtectedRoute>
              }
            />
            <Route path="/buy/:id" element={<BuyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Footer />
        </Router>
      </RecoilRoot>
    </>
  );
}

export default App;
