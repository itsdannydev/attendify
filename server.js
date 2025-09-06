const express = require('express');
const app = express();
const connectDB = require('./mongodb');

connectDB();

app.use(express.static('public'));
app.use(express.json());

app.set('view engine','ejs');

//routes
app.get('/',(req,res)=>{
    res.render('index');
});

//--------------------------------API ENDPOINTS--------------------------------
const Event = require('./models/Event');
//GET Requests
app.get('/events-data',async (req,res)=>{
    try{
        const events = await Event.find();
        const formattedEvents = events.map(event =>({
            id: event.id,
            title: event.title,
            createdAt: event.createdAt.toLocaleDateString('en-GB'),
            participants: event.participants.length
        }));

        res.json({ events: formattedEvents });
    }catch(err){
        console.log('Error fetching events: ',err.message);
        res.json({ message: 'Failed to fetch events from server'});
    }
})
//POST Requests
app.post('/new-event', async (req,res)=>{
    const { eventTitle, adminPass, ocPass, contact } = req.body;
    try{
        //unique id generator
        let id, exists;
        do{
            id='';
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(let i=0;i<4;i++){
                const randomIndex = Math.floor(Math.random()*chars.length);
                id += chars[randomIndex];
            }
            exists = await Event.findOne({ id });
        }while(exists);
        const newEvent = new Event({
            id,
            title: eventTitle,
            users:{ adminPass,ocPass },
            contact
        });
        await newEvent.save();
        console.log(`New Event "${eventTitle}" created`);

        res.json({ success:true, id });
    }catch(err){
        console.log(`Error creating event: `,err.message);
        res.json({ success:false, message:"Event Creation Failed" });
    }
})



const port = 3000
app.listen(port, ()=>{
    console.log("Server is running at port: ",port);
});