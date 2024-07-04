import authenticateJwt from "../auth/authenticateJwt.js";
import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controller/paymentController.js";
const router = express.Router();
import Stripe from "stripe";
import { config } from "dotenv";
import bodyParser from "body-parser";

config({ path: "./config/config.env" });

const stripe = new Stripe(process.env.stripe_Private_Key);

router.post("/stripePayment", authenticateJwt, async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:5173/paymentsuccess`,
    cancel_url: "http://localhost:5173/checkout",
  });

  // console.log(session);
  res.json({ id: session.id, success: true });
});

router.post(
  "/stripeVerification",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = "whsec_mat0J7AGWmdUFltu1oCBUyOqmQU499hq";

    let event;

    try {
      // Use the endpointSecret when constructing the event
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Mark the payment as successful
      // You can update your database or perform other actions here

      console.log("Payment succeeded:", session);
    }

    res.status(200).send("Success");
  }
);

router.post("/checkout", authenticateJwt, checkout);
router.post("/paymentVerification", paymentVerification);

export default router;
