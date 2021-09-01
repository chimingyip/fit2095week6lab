const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dob: Date,
    address: {
        state: {
            type: String,
            validate: {
                validator: function (val) {
                    return val.length >= 2 && val.length <= 3;
                }
            }
        },
        suburb: String,
        street: String,
        unit: {
            type: Number,
            validate: {
                validator: function (val) {
                    return Number.isInteger(val) && val > 0;
                }
            }
        }
    },
    numPatients: {
        type: Number,
        validate: {
            validator: function (val) {
                return Number.isInteger(val) && val >= 0;
            }
        }
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);