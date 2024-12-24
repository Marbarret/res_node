const mongoose = require('mongoose');
const { Schema } = mongoose;

 const AddressSchema = new Schema({
    street: { type: String, required: true },
    number: { type: String, required: true },
    zone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  });

const DocumentType = new Schema({
    document_type: { type: String },
    number: { type: String }
});

const CommomUser = new Schema({
    fullName: { type: String, required: true },
    visibleName: { type: String },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    document: { type: DocumentType, required: true },
    address: { type: AddressSchema, required: true },
    password: { type: String, required: true },
    photo: { type: String },
    terms: { type: Boolean, required: true }
});

module.exports = { AddressSchema, DocumentType, CommomUser };
