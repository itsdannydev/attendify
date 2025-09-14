const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

async function isAttendanceLocked(req, res, next) {
    try{
        const token = req.cookies.authCookie;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const event = await Event.findOne({ id:payload.eventId });

        if(event.attendanceLocked){
            if(req.body == undefined){
                return res.redirect(`/?message=${encodeURIComponent("Attendance is locked for the event")}`)
            }
            return res.json({ success:false, message: "Attendance is locked for the event" });
        }

        req.event = event;
        next();
    }catch(err){
        console.log("Attendance Lock Check Error: ",err.message);
        if(req.body == undefined){
            return res.redirect(`/?message=${encodeURIComponent("Error checking attendance lock")}`)
        }
        res.json({ success:false, message:"Error checking attendance lock"});
    } 
}

module.exports = isAttendanceLocked;