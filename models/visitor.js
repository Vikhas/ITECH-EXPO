const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: String,
    count: Number
});

module.exports = mongoose.model("Visitors",visitorSchema);