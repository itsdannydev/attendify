//global DOM elems
const createEvent = document.getElementById('create-event');
const createEventCard = document.getElementById('create-event-card');

//fetching and adding events data
async function getEvents(){
    try{
        const res = await fetch('/events-data');
        const data = await res.json();
        console.log('Event details fetched');
        notify('Events Loaded');
        
        if(data.events.length == 0){
            createEventCard.classList.remove('hide');
        } else {
            createEventCard.classList.add('hide');
            showEvents(data.events);
        }
    }catch(err){
        console.log('Error fetching data from server: ',err);
    }
}
getEvents();

//popup toggle
createEvent.addEventListener('click',()=>{
    popupForm();
});
createEventCard.addEventListener('click',()=>{
    popupForm();
});

//functions
function showEvents(events){
    const eventsBody = document.getElementById('events-body');
    eventsBody.innerHTML='';
        events.forEach( event => {
            /*
                If ever the db accumulates 1000+ events, this approach will get slower,
                in each loop the inenrHTML is reparsed. Furthermore, the innerHTML data 
                also increases with each loop.

                In that case do Manual DOM Building (.createElement(), .appendChild().. etc)
                This way, the data is appended in each loop, its never wiped and re-written
            */
            eventsBody.innerHTML += `
            <div class="event-card" id="${event.id}">
                <div class="info-container">
                    <h4>${event.title}</h4>
                    <p>Created At: ${event.createdAt}</p>
                    <span>Participants: ${event.participants}</span>
                </div>
                <div class="btn-container">
                    <button class="manage">Manage</button>
                    <button class="edit">Edit</button>
                    <button class="attendance">Attendance</button>
                </div>
            </div>
            `
    });
}