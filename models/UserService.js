import mongoose from "mongoose";

const userServiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceName: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    bookingDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("UserService", userServiceSchema);
