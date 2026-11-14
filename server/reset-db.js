import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function resetDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully");
    await mongoose.disconnect();
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

resetDB();
