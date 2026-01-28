import mongoose, { trusted } from "mongoose";

const itineraryPlanningSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

export const itineraryPlan = mongoose.model("itineraryPlan", itineraryPlanningSchema);