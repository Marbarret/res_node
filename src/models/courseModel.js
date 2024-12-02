const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lesson_id: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    content_type: { type: String, required: true },
});

const moduleSchema = new mongoose.Schema({
    module_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    level: { type: String, default: "Não especificado" },
    language: { type: String, default: "Português" },
    instructor: {
        name: { type: String, required: true },
        bio: { type: String },
        profile_picture_url: { type: String },
        contact: {
            email: { type: String },
            linkedin: { type: String },
        },
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    price: {
        currency: { type: String, required: true },
        amount: { type: Number, required: true },
        discount: {
            percent: { type: Number },
            valid_until: { type: Date },
        },
    },
    modules: [moduleSchema],
    requirements: { type: [String], default: [] },
    objectives: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    reviews: [
        {
            review_id: { type: String },
            user: { type: String },
            rating: { type: Number },
            comment: { type: String },
            date: { type: Date },
        },
    ],
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);