import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  'StateName': String,
  'PinCodes': [String]
});

// Create a model based on the schema
const States = mongoose.models.states || mongoose.model('states', stateSchema);

export default States;
