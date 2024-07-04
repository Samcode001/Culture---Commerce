import React from "react";
import "../styles/About.css";
import Footer from "../components/Footer";

const Faq = () => {
  return (
    <div>
      <div class="accordion">
        <h1>Frequently Asked Questions</h1>
        <div class="accordion-item">
          <input type="checkbox" id="accordion1" />
          <label for="accordion1" class="accordion-item-title">
            <span class="icon"></span>What payment methods do you accept?
          </label>
          <div class="accordion-item-desc">
            We accept payments via credit/debit cards, net banking, UPI, and
            cash on delivery (COD) for eligible orders.
          </div>
        </div>

        <div class="accordion-item">
          <input type="checkbox" id="accordion2" />
          <label for="accordion2" class="accordion-item-title">
            <span class="icon"></span>How can I track my order?
          </label>
          <div class="accordion-item-desc">
            Once your order is shipped, you will receive a tracking link via
            email or SMS. You can click on the link to track the status of your
            delivery in real-time.
          </div>
        </div>

        <div class="accordion-item">
          <input type="checkbox" id="accordion3" />
          <label for="accordion3" class="accordion-item-title">
            <span class="icon"></span>What is your return policy?
          </label>
          <div class="accordion-item-desc">
            We offer a hassle-free return policy. If you are not satisfied with
            your purchase, you can initiate a return request within 14 days of
            delivery. Please refer to our Returns & Refunds page for more
            details.
          </div>
        </div>

        <div class="accordion-item">
          <input type="checkbox" id="accordion4" />
          <label for="accordion4" class="accordion-item-title">
            <span class="icon"></span>Do you offer international shipping?
          </label>
          <div class="accordion-item-desc">
            Yes, we offer international shipping to select countries. Shipping
            charges and delivery times may vary depending on the destination.
            You can check the availability of international shipping during
            checkout.
          </div>
        </div>

        <div class="accordion-item">
          <input type="checkbox" id="accordion5" />
          <label for="accordion5" class="accordion-item-title">
            <span class="icon"></span>How can I contact customer support?
          </label>
          <div class="accordion-item-desc">
            You can reach our customer support team via email at
            himanshuthecoder869@gmail.com ,Our support team is available 5 days
            a week to assist you with any queries or concerns you may have.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
