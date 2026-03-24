import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo database connected succefully...");
    }
    catch (error){
        console.log("Error in database connection??? Check URI", error);
        process.exit(1);
        
    }
}

export default connectDB;