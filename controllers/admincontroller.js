import { schemaModel } from "../models/index.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
const admincontroller = {
  createBooking: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        serviceId,
        bookingDate,
        timeSlot,
        guestCount,
        price,
        location,
        notes,
      } = req.body;

      // 1️⃣ Validation
      if (
        !name ||
        !email ||
        !phone ||
        !serviceId ||
        !bookingDate ||
        !timeSlot ||
        !guestCount ||
        !price ||
        !location
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be filled",
        });
      }

      const normalizedDate = new Date(bookingDate);

      // 2️⃣ Find or create user
      let user = await schemaModel.UserModel.findOne({ email });

      if (!user) {
        user = await schemaModel.UserModel.create({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        });
      }

      // 3️⃣ Check existing booking (DATE + TIME + SERVICE)
      const existingBooking = await schemaModel.BookingModel.findOne({
        userId: user._id,
        serviceId,
        bookingDate: normalizedDate,
        timeSlot,
      });

      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already booked for the selected date",
        });
      }

      // 4️⃣ Create booking
      const booking = await schemaModel.BookingModel.create({
        userId: user._id,
        serviceId,
        bookingDate: normalizedDate,
        timeSlot,
        guestCount,
        price,
        location,
        notes,
      });


      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          booking,
          user,
        },
      });
    } catch (error) {
      console.error("CREATE BOOKING ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

   getUserAll :async (req, res) => {
  try {
    const users = await schemaModel.UserModel.find(); // fetch all users from database
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch users",
      error: error.message,
    });
  }
  },

   getUserById: async (req, res) => {
    try {
      const id = req.params._id;
      const user = await schemaModel.UserModel.findById({_id:id});

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server Error: Unable to fetch user",
        error: error.message,
      });
    }
  },


  deleteUser:async(req,res)=>{
     try {
    const userId = req.params._id;

    // Check if user exists
    const user = await schemaModel.UserModel.findById({_id:id});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await schemaModel.UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete user",
      error: error.message,
    });
  }
  },

  getBookingsByUser:async(req,res)=>{
      try {
    const userId = req.params._id;

    const bookings = await schemaModel.BookingModel.find({ userId: userId }); 
    // Assuming `user` field in BookingModel stores user ID

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch bookings",
      error: error.message,
    });
  }
  },
login: async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await schemaModel.UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password not set",
      });
    }
console.log(password.toString())
console.log(user.password)
    // 🔐 bcrypt compare (SAFE)
    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

};

export default admincontroller;
