import { notify } from "./global.js";
import { showPopup } from './popup/popup.js'

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
const createEvent = document.getElementById('create-event');
const createEventCard = document.getElementById('create-event-card');
createEvent.addEventListener('click',()=>{
    showPopup("create");
});
createEventCard.addEventListener('click',()=>{
    showPopup("create");
});

//functions
function showEvents(events){
    const eventsBody = document.getElementById('events-body');
    eventsBody.innerHTML='';
        events.forEach( event => {
            /*
                CHANGED. COMMENT NOT DELETED JUST FOR FUTURE NOTES.
                (OLD)If ever the db accumulates 1000+ events, this approach will get slower,
                in each loop the inenrHTML is reparsed. Furthermore, the innerHTML data 
                also increases with each loop.

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

                (NEW)In that case do Manual DOM Building (.createElement(), .appendChild().. etc)
                This way, the data is appended in each loop, its never wiped and re-written
            */

            //event card
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.id=event.id;

            //info container
            const infoContainer = document.createElement('div');
            infoContainer.classList.add('info-container');
            const h4 = document.createElement('h4');
            h4.textContent=event.title;
            const p = document.createElement('p');
            p.textContent = `Created At: ${event.createdAt}`;
            const span = document.createElement('span');
            span.textContent=`Participants: ${event.participants}`
            infoContainer.appendChild(h4);
            infoContainer.appendChild(p);
            infoContainer.appendChild(span);

            //button container
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
            btnContainer.appendChild(createButton('manage','Manage',()=>{
                window.location.href = `/add-participants/${event.id}`;
            }))
            btnContainer.appendChild(createButton('edit','Edit',()=>{
                showPopup("edit",event);
            }))
            btnContainer.appendChild(createButton('attendance','Attendance',()=>{
                window.location.href = `/attendance/${event.id}`;
            }))

            //final appending
            eventCard.appendChild(infoContainer);
            eventCard.appendChild(btnContainer);
            eventsBody.appendChild(eventCard);

    });
}

//function to create buttons in event card
function createButton(className, text, onClick) {
    const btn = document.createElement('button');
    btn.classList.add(className);
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
}