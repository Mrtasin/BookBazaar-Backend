import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB not Connected, Error :- ", error);
    process.exit(0);
  }
};

export default connectDB;
