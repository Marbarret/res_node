const mongoose = require('mongoose');
const CommomSchema = require('./commomModel');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  role: { type: String, enum: ['user', 'company'], require: true },
  general: { type: CommomSchema.GenericUser, required: true },
  password: { type: String, required: true },
  funcionarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeSchema' }],
  planos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransPlanSchema' }],
  rotas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RouteSchema' }],
  veiculos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VehicleSchema' }],
  terms: { type: Boolean, required: true }
}, { _id: false });

const VehicleSchema = new Schema({
  id: { type: String, required: true },
  placa: { type: String, required: true },
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  ano: { type: String, required: true },
  tipo: { type: String, required: true }
}, { _id: false });

const EmployeeSchema = new Schema({
  id: { type: Int32, required: true },
  general: { type: mongoose.Schema.Types.ObjectId, ref: 'GenericUser' }, 
  position: { type: String, required: true }
}, { _id: false });

const RouteSchema = new Schema({
  id: { type: Int32, required: true },
  destiny: { type: String },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleSchema' },
  hour_begin: { type: String, required: true },
  hour_finish: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { _id: false });