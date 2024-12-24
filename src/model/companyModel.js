const mongoose = require('mongoose');
const CommomSchema = require('./commomModel');
const { Schema } = mongoose;

const TransPlanSchema = new Schema({
  plan_type: { type: String, required: true },
  week: { type: [String], required: true },
  schedules: {
    collect: { type: String, required: true },
    delivery: { type: String, required: true }
  }
});

const CompanySchema = new Schema({
  general: { type: CommomSchema.CommomUser, required: true },
  funcionarios: { type: String },
  planos: { type: String },
  rotas: { type: String }, 
  veiculos: { type: VeiculoSchemas }
});

const VeiculoSchema = new Schema({
  id: { type: Int32, required: true },
  placa: { type: String },
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  ano: { type: String, required: true },
  tipo: { type: String, required: true }
});