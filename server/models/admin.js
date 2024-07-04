import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      requireed: true,
    },
  },
  address: {
    type: Array,
  },
});

const USER = mongoose.model("Admin", adminSchema);

export { USER };
