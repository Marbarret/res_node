const mongoose = require('mongoose');
const commomModel = require('./commomModel');
const { Schema } = mongoose;

const DependentSchema = new Schema({
  geral: {type: commomModel.GenericUser, required: true},
  relationship: { type: String },
  school_name: { type: String },
  observation: { type: String },
  trans_plan: { type: mongoose.Schema.Types.ObjectId, ref: 'TransPlanSchema' }
});

const UserSchema = new Schema({
  role: { type: String, enum: ['user', 'company'] },
  responsible: { type: commomModel.GenericUser },
  password: { type: String, required: true },
  dependent: { type: [DependentSchema] },
  isVerified: { type: Boolean, default: false },
  verification: {
    method: { type: String }
  },
  terms: { type: Boolean }
}, { _id: false });

module.exports = mongoose.model('User', UserSchema);
