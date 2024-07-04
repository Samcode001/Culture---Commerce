import express from "express";
import { USER } from "../models/admin.js";
const router = express.Router();
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import authenticateJwt from "../auth/authenticateJwt.js";
import { v2 as cloudinary } from "cloudinary";

const adminInputProps = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  name: z.string().min(2),
});

router.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);
    const parsedData = adminInputProps.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(401)
        .json({ message: "Provide Valid Inputs", success: false });
    }

    const { username, password, name, avatar } = req.body;
    console.log(username, password, name, avatar);

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    const admin = await USER.findOne({ username: username });
    if (admin) {
      // const fileName = req.file.filename;
      // const filePath = `uploads/${fileName}`;
      // fs.unlink(filePath, (error) => {
      //   if (error) console.log(`Error in deleting file :${error}`);
      // });

      res.status(409).json({ message: "User Already Exist", success: false });
    } else {
      // const fileName = req.avatar.filename;
      // const fileUrl = path.join(fileName);

      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "user",
      });

      const newAdmin = new USER({
        name: name,
        username: username,
        password: securePassword,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        address: [],
      });

      await newAdmin.save();
      res.status(200).json({
        message: "User created",
        success: true,
        token: jwt.sign({ admin: newAdmin.username }, process.env.jwtSecret),
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Internal Server Error:${error} `, success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await USER.findOne({ username });
    if (!admin)
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });

    const flag = await bcrypt.compare(password, admin.password);
    if (flag)
      res.status(200).json({
        message: "Logged in Succesfully",
        success: true,
        token: jwt.sign({ admin: admin.username }, process.env.jwtSecret),
      });
    else {
      res.status(401).json({ message: "Invalid Credentials", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error ", success: false });
  }
});

router.post("/getUser", authenticateJwt, async (req, res) => {
  try {
    const username = req.headers["user"].admin;
    const user = await USER.findOne({ username });
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).send(`Error in Route :${error}`);
  }
});

router.post("/address", authenticateJwt, async (req, res) => {
  try {
    const { address } = req.body;
    const user = req.headers["user"].admin;
    const admin = await USER.findOne({ username: user });

    // if (admin.address.length === 0) {
    let tempAddress = address;
    const foramtAddress = `${tempAddress.address},${tempAddress.City},${tempAddress.State},${tempAddress.Country} (${tempAddress.Pincode})`;
    admin.address.push(foramtAddress);
    await USER.findOneAndUpdate({ username: user }, admin, { new: true });
    // }
    res.status(201).json({ success: true, message: "Address Added" });
    // console.log(user,admin.address)
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

router.get("/address", authenticateJwt, async (req, res) => {
  try {
    const { address } = req.body;
    const user = req.headers["user"].admin;
    const admin = await USER.findOne({ username: user });
    if (admin.address.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Address Found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Address Found",
        address: admin.address,
      });
    }
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

export default router;
