import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find admin by old email and update
    const admin = await User.findOneAndUpdate(
      { email: "admin@autohomebatteries.com" },
      {
        name: "Mohammed Umer A",
        email: "autohomebatteries@gmail.com",
        mobile: "9789688756",
      },
      { new: true }
    );

    if (admin) {
      console.log("Admin updated:");
      console.log("  Name:", admin.name);
      console.log("  Email:", admin.email);
      console.log("  Mobile:", admin.mobile);
      console.log("  Role:", admin.role);
    } else {
      console.log("No admin found with old email, checking all admins...");
      const admins = await User.find({ role: "admin" });
      admins.forEach(a => console.log("  Admin:", a.name, a.email, a.mobile));
    }

    await mongoose.disconnect();
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

updateAdmin();
