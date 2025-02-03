const mongoose = require('mongoose');
const { Schema } = mongoose;

 const AddressSchema = new Schema({
    street: { type: String, required: true },
    number: { type: String, required: true },
    zone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  }, { _id: false });

  const DocumentType = new Schema({
    document_type: { 
        type: String, 
        enum: ['CPF', 'CNPJ'],
        required: true 
    },
    number: { 
        type: String, 
        validate: {
            validator: function(value) {
                if (!this.document_type) return false;
                if (this.document_type === 'CPF') {
                    return /ˆ\d{11}/.test(value);
                } else if (this.document_type === 'CNPJ') {
                    return /ˆ\d{14}/.test(value);
                }
                return false;
            },
            message: props => `${props.value} não é válido para o tipo ${props.instance.document_type}`
        }
    }
}, { _id: false });

const GenericUser = new Schema({
    fullName: { type: String, required: true },
    genericName: { type: String },
    email: { type: String, unique: true },
    contact: { type: String },
    document: { type: DocumentType },
    address: { type: AddressSchema },
    photo: { type: String }
}, { timestamps: true });

const TransPlanSchema = new Schema({
    planCode: { type: String, required: true }, 
    plan_type: { type: String, required: true },
    rota: { type: mongoose.Schema.Types.ObjectId, ref: 'RouteSchema', required: true },
    value: { type: Number, required: true },
    vehicle_type: { type: String, required: true },
    validity_period: { 
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true } 
    },
    included_services: [String],
    restrictions: [String]
  }, { _id: false });

module.exports = { GenericUser, TransPlanSchema };
