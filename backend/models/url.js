const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    referrer: { type: String, default: '' },
    geo: { type: String, default: '' }
});

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    clicks: [clickSchema]
});

module.exports = mongoose.model('Url', urlSchema);
