import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  // img: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: Number,
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
  user:{
    type:String,
    required:true
  },
  cart:{
    type:Array,
  }
});

const CART = new mongoose.model("cart", cartSchema);

export default CART;
