import React, { useEffect, useRef } from "react";
import "../styles/Footer.css";
import logo from "../assets/images (1).jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  const navigationRef = useRef(null);

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleLinkClick = () => {
    // Scroll to the top when a link is clicked
    window.scrollTo(0, 0);
  };
  return (
    <div className="footer">
      <footer class="primary-footer">
        <div class="container">
          <div class="primary-footer-wrapper">
            <div>
              <a href="#">
                <img
                  style={{ filter: "invert(100%)" }}
                  class="footer-logo"
                  src={logo}
                  alt="footer-logo"
                />
              </a>
              <ul
                role="list"
                class="primary-footer-navigation  animated"
                ref={navigationRef}
              >
                <li>
                  <Link to="/" onClick={handleLinkClick}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" onClick={handleLinkClick}>
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={handleLinkClick}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/faq" onClick={handleLinkClick}>
                    Faq's
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleLinkClick}>
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <span>&copy; 2023 Culture & Commerce. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
