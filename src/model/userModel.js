const mongoose = require('mongoose');
const AddressSchema = require('./commomModel');
const { Schema } = mongoose;

const TransPlanSchema = new Schema({
  plan_type: { type: String, required: true },
  week: { type: [String], required: true },
  schedules: {
    collect: { type: String, required: true },
    delivery: { type: String, required: true }
  }
});

const DependentSchema = new Schema({
  fullName: { type: String, required: true },
  firstName: { type: String, required: true },
  date_birth: { type: Date, required: true },
  sex: { type: String, required: true },
  photo: { type: String },
  relationship: { type: String },
  school_name: { type: String },
  collect_address: { type: AddressSchema, required: true },
  observation: { type: String },
  trans_plan: { type: TransPlanSchema, required: true }
});

const ResponsibleSchema = new Schema({
  fullName: { type: String, required: true },
  firstName: { type: String },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  dt_birth: { type: Date },
  document: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  document_type: { type: String },
  password: { type: String, required: true },
  terms: { type: Boolean, required: true }
});

const UserSchema = new Schema({
  responsible: { type: ResponsibleSchema, required: true },
  dependent: { type: [DependentSchema], required: true },
  verification: {
    verification_sms: {
      sent_cod: { type: String, required: true },
      status: { type: String, required: true }
    },
    verification_email: {
      sent_cod: { type: String, required: true },
      status: { type: String, required: true }
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
