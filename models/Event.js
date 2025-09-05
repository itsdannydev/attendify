const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    users: [
        {
            adminPass: {
                type: String,
                required: true
            },
            ocPass: {
                type: String,
                required: true
            }
        }
    ],
    attendanceLocked:{
        type: Boolean,
        required: true,
        default: false
    },
    participants:[
        {
            name:{
                type: String,
                required: true
            },
            regno:{
                type: String,
                required: true
            },
            phoneno:String,
            present:{
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Event',eventSchema);