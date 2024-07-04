import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  orders: {
    type: Array,
    required: true,
  },
});

const ORDER = new mongoose.model("order", orderSchema);

export default ORDER;
