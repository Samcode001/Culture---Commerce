import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },
  // img: {
  //   type: String,
  //   required: true,
  // },
  // memory: {
  //   type: String,
  //   required: true,
  // },
  // type: {
  //   type: String,
  //   required: true,
  // },
  // os: {
  //   type: String,
  //   required: true,
  // },
  user: {
    type: String,
    required: true,
  },
  list:{
    type:Array
  }
});

const WISHLIST = new mongoose.model("wishList", wishListSchema);

export default WISHLIST;
