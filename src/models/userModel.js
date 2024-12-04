const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlanoTransporteSchema = new Schema({
  tipo: { type: String, required: true },
  dias_semana: { type: [String], required: true },
  horarios: {
    coleta: { type: String, required: true },
    entrega: { type: String, required: true }
  }
});

const EnderecoSchema = new Schema({
  rua: { type: String, required: true },
  numero: { type: String, required: true },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cep: { type: String, required: true }
});

const DependenteSchema = new Schema({
  nome_completo: { type: String, required: true },
  data_nascimento: { type: Date, required: true },
  sexo: { type: String, required: true },
  foto: { type: String },
  nome_escola: { type: String },
  endereco_coleta: { type: EnderecoSchema, required: true },
  restricoes_observacoes: { type: String },
  plano_transporte: { type: PlanoTransporteSchema, required: true }
});

const ResponsavelSchema = new Schema({
  nome_completo: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  data_nascimento: { type: Date, required: true },
  cpf: { type: String, required: true },
  endereco: { type: EnderecoSchema, required: true },
  tipo_documento: { type: String, required: true },
  senha: { type: String, required: true },
  confirmacao_senha: { type: String, required: true },
  termos_aceitos: { type: Boolean, required: true }
});

const UserSchema = new Schema({
  responsavel: { type: ResponsavelSchema, required: true },
  dependentes: { type: [DependenteSchema], required: true },
  verificacao: {
    verificacao_sms: {
      codigo_enviado: { type: String, required: true },
      status: { type: String, required: true }
    },
    verificacao_email: {
      codigo_enviado: { type: String, required: true },
      status: { type: String, required: true }
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
