import { instance } from "../index.js";
import crypto from "crypto";
import { config } from "dotenv";

config({ path: "./config/config.env" });

export const checkout = async (req, res) => {
  try {
    let { amount } = req.body;
    console.log(amount)
    amount = Math.floor(amount * 100);
    var options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    // console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      error: `Error:${error}`,
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_payment_id } = req.body;
  const shashum = crypto.createHmac("sha256", process.env.razorpay_hook_secret); // the same secret you provided in making the hook
  // const shashum = crypto.createHmac("sha256", process.env.razorpay_api_key); // the same secret you provided in making the hook
  shashum.update(JSON.stringify(req.body));
  const digest = shashum.digest("hex");

  const signature = req.headers["x-razorpay-signature"];
  // const { razorpay_signature } = req.body.response;

  // console.log(digest, signature); // The signature is came out with headers of webHook
  const d = Date.now();
  const today = new Date(d);
  today.toString();
  if (digest === signature) {
    res.status(200).json({ success: true }); // it is mandatory to give the 200 response to web hook otherwise the razorpay will remove the hhok
    // console.log("Success");
    // console.log(today);
  } else {
    res.status(401).json({ success: false });
    console.log("Failure");
    console.log(today);
  }
};

// const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//   req.body; // we get this from the callback done by razorpay internal library

// const body = razorpay_order_id + "|" + razorpay_payment_id;

// const expectedSignature = crypto
//   .createHmac("sha256", process.env.razorpay_api_key)
//   .update(body.toString())
//   .digest("hex");

// const isAuthentic = expectedSignature === razorpay_signature;

// if (isAuthentic) {
//   // Database comes here
//   res.redirect(
//     `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
//   );
// } else {
//   console.log({
//     success: false,
//     isAuthentic,
//     payID: razorpay_payment_id,
//     OrderId: razorpay_order_id,
//     Sign: razorpay_signature,
//   });
//   res.status(400).json({
//     success: false,
//     isAuthentic,
//     payID: razorpay_payment_id,
//     OrderId: razorpay_order_id,
//     Sign: razorpay_signature,
//   });
// }
