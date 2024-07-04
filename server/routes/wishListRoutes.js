import express from "express";
const router = express.Router();
import authenticateJwt from "../auth/authenticateJwt.js";
import WISHLIST from "../models/wishList.js";

router.post("/addItem", async (req, res) => {
  try {
    const { name, img, os, memory, type, price, user } = req.body;
    // const user = req.headers["user"].admin;
    const userExist = await WISHLIST.findOne({ user: user });

    const newItem = {
      name: name,
      price: price,
      img: img,
      type: type,
      os: os,
      memory: memory,
    };

    if (!userExist) {
      const newUserCart = WISHLIST({
        user: user,
        list: [newItem],
      });
      await newUserCart.save();
    } else {
      const itemPresent = userExist.list.find((elem) => elem.name === name);
      if (itemPresent)
        return res
          .status(201)
          .json({ success: false, message: "Item Already Added" });
      userExist.list.push(newItem);
      await WISHLIST.findOneAndUpdate({ user: user }, userExist, { new: true });
    }

    res.status(200).json({ success: true, message: "Item wishlisted" });
    //   return res
    //     .status(201)
    //     .json({ success: false, message: "Item Already Added" });

    // const newItem = WISHLIST({
    //   name: name,
    //   img: img,
    //   type: type,
    //   os: os,
    //   memory: memory,
    //   price: price,
    //   user: user,
    // });

    // await newItem.save();
    // res.status(200).json({ success: true, message: "Item Added" });
  } catch (error) {
    res.status(500).send(`Error In Route :${error}`);
  }
});

router.post("/getItems", async (req, res) => {
  try {
    // const user = req.headers["user"].admin;
    const { user } = req.body;
    const userList = await WISHLIST.findOne({ user: user });
    res.status(200).json({ wishListItems: userList.list });
  } catch (error) {
    res.status(500).send(`Error  in Route:${error}`);
  }
});

router.post("/removeItem", async (req, res) => {
  try {
    const { name, user } = req.body;

    // const user = req.headers["user"].admin;
    const userList = await WISHLIST.findOne({ user: user });

    let list = userList.list;

    const updatedList = list.filter((elem) => elem.name !== name);
    userList.list.length = 0;
    userList.list = updatedList;
    await WISHLIST.findOneAndUpdate({ user: user }, userList, { new: true });

    res.status(201).send("Item Deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
