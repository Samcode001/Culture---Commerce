import express from "express";
import authenticateJwt from "../auth/authenticateJwt.js";
import ORDER from "../models/order.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import easyInvoice from "easyinvoice";

// const data = {
//   images: {
//     logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
//     background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
//   },
//   sender: {
//     company: "Sample Corp",
//     address: "Sample Street 123",
//     zip: "1234 AB",
//     city: "Sampletown",
//     country: "Samplecountry",
//   },
//   client: {
//     company: "Client Corp",
//     address: "Clientstreet 456",
//     zip: "4567 CD",
//     city: "Clientcity",
//     country: "Clientcountry",
//   },
//   information: {
//     number: "2022.0001",
//     date: "1.1.2022",
//     "due-date": "15.1.2022",
//   },
//   products: [
//     {
//       quantity: "2",
//       description: "Test1",
//       "tax-rate": 6,
//       price: 33.87,
//     },
//     {
//       quantity: "4",
//       description: "Test2",
//       "tax-rate": 21,
//       price: 10.45,
//     },
//   ],
//   "bottom-notice": "Kindly pay your invoice within 15 days.",
//   settings: {
//     currency: "USD",
//     "tax-notation": "vat",
//     "margin-top": 25,
//     "margin-right": 25,
//     "margin-left": 25,
//     "margin-bottom": 25,
//   },
// };

// easyInvoice.createInvoice(data, (result) => {
//   console.log(result.pdf);
// });

router.post("/order", authenticateJwt, async (req, res) => {
  try {
    const user = req.headers["user"].admin;
    const { order, total } = req.body;
    const orderId = uuidv4();
    const currentDate = new Date();
    const currenDateForamt = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;
    const timeForamt = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const dateFormat = `${currenDateForamt} ${timeForamt}`;

    const userExist = await ORDER.findOne({ user: user });

    if (!userExist) {
      const newOrder = new ORDER({
        user: user,
        orders: [
          {
            orderId: orderId,
            date: dateFormat,
            order: order,
            total: total,
          },
        ],
      });

      await newOrder.save();

      res.status(200).json({ message: "Order created", success: true });
    } else {
      const newOrder = {
        orderId: orderId,
        date: dateFormat,
        order: order,
        total: total,
      };

      //   userExist.orders.push(newOrder);

      const addOrder = await ORDER.findOneAndUpdate(
        { user: user },
        { $push: { orders: newOrder } }, // will push the newOrder data to the orders array
        { new: true }
      );
      res.status(201).json({ message: "Order added", success: true });
    }
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

router.get("/order", authenticateJwt, async (req, res) => {
  try {
    const user = req.headers["user"].admin;
    // const { user } = req.user;

    const orders = await ORDER.findOne({ user: user });

    if (orders) {
      res.status(200).json({ success: true, orders });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

export default router;
