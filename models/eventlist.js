const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    ename:{type: String, require: true},
    starthr:{type: Number, require: true},
    startmin:{type: Number, require: true},
    endhr:{type:Number, require: true},
    endmin:{type: Number, require: true},
    content:{type: String, require: true},
    startnoon:{type: String, require: true},
    endnoon:{type: String, require: true},
    location:{type: String, require: true},
    day:{type:Number, require: true}
});

module.exports = mongoose.model("Events",eventSchema);