const express = require('express');
const app = express();
const connectDB = require('./mongodb');

connectDB();

app.use(express.static('public'));

app.set('view engine','ejs');

//routes
app.get('/',(req,res)=>{
    res.render('index');
});

//api endpoints
app.get('/events-data',(req,res)=>{
    const events = [
        {
            title: "Myth Busters",
            createdAt: "04/09/2025",
            participants: 240
        },
        {
            title: "OpenCV",
            createdAt: "04/09/2025",
            participants: 120
        }
    ]
    // const events = []
    res.json({ events })
})

const port = 3000
app.listen(port, ()=>{
    console.log("Server is running at port: ",port);
});