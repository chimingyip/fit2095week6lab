const mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: {
        type: Number,
        validate: {
            validator: function (val) {
                return val >= 0 && val <= 120 && Number.isInteger(val);
            }
        }
    },
    dateVisited: {
        type: Date,
        default: Date.now
    },
    caseDescription: {
        type: String,
        validate: {
            validator: function (val) {
                return val.length >= 10;
            }
        }
    }
});

module.exports = mongoose.model('Patient', patientSchema);