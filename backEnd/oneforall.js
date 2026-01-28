import express from "express";
import mongoose from "mongoose";
const app = express();

//default endpoint
app.get("/", (req, res) => {
    res.send("This is the default endpoint!");
});

//importing Routes
import userRoutes from "./src/routes/User.Routes.js";
import itineraryRoutes from "./src/routes/Itinerary.Routes.js";

//using Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/itineraries", itineraryRoutes);


//server listerner
app.listen(3000, () => {
    console.log("Server started on port 3000");
    console.log("http://localhost:3000");
});