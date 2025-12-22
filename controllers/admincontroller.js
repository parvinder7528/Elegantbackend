import { schemaModel } from "../models/index.js";

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
  }

};

export default admincontroller;
