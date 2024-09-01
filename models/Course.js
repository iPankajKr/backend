const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Course', courseSchema)