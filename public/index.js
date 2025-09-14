import { notify, isAdmin, isAuth } from "./global.js";
import { showPopup } from './popup/popup.js'

const createEvent = document.getElementById('create-event');
const createEventCard = document.getElementById('create-event-card');

let fullEvents = [];

//fetching and adding events data
export async function getEvents(){
    try{
        const res = await fetch('/events-data');
        const data = await res.json();

        fullEvents = data.events;
        
        console.log('Event details fetched');
        notify('Events Loaded');
        
        if(fullEvents.length == 0){
            createEventCard.classList.remove('hide');
        } else {
            createEventCard.classList.add('hide');
            showEvents(fullEvents);
        }
    }catch(err){
        console.log('Error fetching data from server: ',err);
    }
}
getEvents();

//popup toggle
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
            const idSpan = document.createElement('span');
            idSpan.id = 'id-span';
            idSpan.textContent = `Event ID: `;
            const code = document.createElement('span');
            code.textContent = event.id;
            idSpan.appendChild(code);
            const p = document.createElement('p');
            p.textContent = `Created At: ${event.createdAt}`;
            const participantSpan = document.createElement('span');
            participantSpan.id = 'participant-span';
            participantSpan.textContent=`Participants: ${event.participants}`
            infoContainer.appendChild(h4);
            infoContainer.appendChild(idSpan);
            infoContainer.appendChild(p);
            infoContainer.appendChild(participantSpan);

            //button container
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
            btnContainer.appendChild(createButton('manage','Manage',async ()=>{
                if(await isAuth(event.id)){
                    window.location.href = `/add-participants/${event.id}`;
                }else{
                    showPopup('auth',event);
                }
            }))
            btnContainer.appendChild(createButton('edit','Edit',async ()=>{
                if(await isAdmin(event.id)){
                    showPopup("edit",event);
                }else{
                    showPopup('adminAuth',event);
                }
            }))
            btnContainer.appendChild(createButton('attendance','Attendance',async ()=>{
                if(await isAuth(event.id)){
                    window.location.href = `/attendance/${event.id}`;
                }else{
                    showPopup('auth',event);
                }
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

//searching events functionality
const searchEventsInput = document.getElementById('search-events-input');
searchEventsInput.addEventListener('input',()=>{
    const val = searchEventsInput.value.toLowerCase().trim();

    const filteredEventsArray = fullEvents.filter(event => 
        event.title.toLowerCase().includes(val) ||
        event.id.toLowerCase().includes(val)
    );

    showEvents(filteredEventsArray);
})