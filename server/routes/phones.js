import express from "express";
import PHONES from "../models/phones.js";
import RATINGS from "../models/ratings.js";
import authenticateJwt from "../auth/authenticateJwt.js";
import { USER } from "../models/admin.js";
const router = express.Router();

// const phonesModel = mongoose.model("phones", new mongoose.Schema({}), "phones");

router.get("/phones", async (req, res) => {
  try {
    // const phonesData = await phonesModel.find({}).exec();
    const phonesData = await PHONES.find({});
    // console.log(phonesData)
    if (phonesData) return res.status(200).json({ phones: phonesData });
    res.status(404).send("Data Not Found");
  } catch (error) {
    res.status(500).send(`Error in Route: ${error}`);
  }
});

router.get("/android", async (req, res) => {
  try {
    // const phonesData = await phonesModel.find({}).exec();
    const phonesData = await PHONES.find({});
    // console.log(phonesData)
    if (phonesData) return res.status(200).json({ phones: phonesData });
    res.status(404).send("Data Not Found");
  } catch (error) {
    res.status(500).send(`Error in Route: ${error}`);
  }
});

router.post("/set-rating", authenticateJwt, async (req, res) => {
  try {
    const user = req.headers["user"].admin;
    const userObject = await USER.findOne({ username: user });
    const { id, rate, title, desc } = { ...req.body };
    const date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
    const product = await RATINGS.findOne({ productId: id });
    if (!product) {
      const newProduct = RATINGS({
        productId: id,
        ratings: [
          {
            rate: rate,
            title: title,
            description: desc,
            user: userObject.name,
            date: date,
          },
        ],
      });

      await newProduct.save();
      res.status(200).json({ success: true, message: "Reviewed Submitted" });
    } else {
      let userExist = product.ratings.find(
        (elem) => elem.user === userObject.name
      );

      if (userExist) {
        return res
          .status(401)
          .json({ success: false, message: "Already Reviewed" });
      }
      // return console.log(name);

      const newrating = {
        rate: rate,
        title: title,
        description: desc,
        user: userObject.name,
        date: date,
      };

      product.ratings.push(newrating);
      await RATINGS.findOneAndUpdate({ productId: id }, product, { new: true });
      res.status(200).json({ success: true, message: "Reviewed Submitted" });
    }
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

router.post("/ratings", async (req, res) => {
  try {
    const product = await RATINGS.findOne({ productId: req.body.id });
    if (product) res.status(200).json({ ratings: product.ratings });
    else res.status(200).json({ ratings: 0 });
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

export default router;
