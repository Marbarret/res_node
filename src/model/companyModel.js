const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransPlanSchema = new Schema({
  plan_type: { type: String, required: true },
  week: { type: [String], required: true },
  schedules: {
    collect: { type: String, required: true },
    delivery: { type: String, required: true }
  }
});