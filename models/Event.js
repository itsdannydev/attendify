const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    users: {
        adminPass: {
            type: String,
            required: true
        },
        ocPass: {
            type: String,
            required: true
        }
    },
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
            phno:String,
            present:{
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    contact: {
        type: String,
        required: true
    }
})

//create a DB level uniqueness for event id
/*
    If two users generate an event at same time, the server code checks for the id's existence in mongoDB
    and sees nothing, hence adds it to the DB from both clients. (very rare but possible case)
*/
eventSchema.index({ id:1 }, { unique:true });
// 1 implies to store it in ascending order (doesnt matter here), -1 for descending
// unique : true says, whatever the server says, this value should be unique in the db

module.exports = mongoose.model('Event',eventSchema);