import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      required: true
    },
      role: {
      type: Number,
      // required: true
    },
    password:{
      type:String
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
