import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  title: { type: String, required: true },
  destinations: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  activities: [{ type: String }],
  budget: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  dailyBreakdown: [{ type: String }],
  isPublic: { type: Boolean, default: false },
  status: { type: String, enum: ['Draft', 'Published', 'Completed'], default: 'Draft' }
}, { timestamps: true });

export default mongoose.model('Itinerary', ItinerarySchema);