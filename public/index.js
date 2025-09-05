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
        
        console.log(createEventCard)
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
createEvent.addEventListener('click',openPopup);
createEventCard.addEventListener('click',openPopup);

//functions
function showEvents(events){
    const eventsBody = document.getElementById('events-body');
    eventsBody.innerHTML='';
        events.forEach( event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            const infoContainer = document.createElement('div');
            infoContainer.classList.add('info-container');
            const h1 = document.createElement('h4');
            h1.textContent=event.title;
            const p = document.createElement('p');
            p.textContent = `Created At: ${event.createdAt}`;
            const span = document.createElement('span');
            span.textContent=`Participants: ${event.participants}`
            infoContainer.appendChild(h1);
            infoContainer.appendChild(p);
            infoContainer.appendChild(span);

            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
            const manageBtn = document.createElement('button');
            manageBtn.classList.add('manage');
            manageBtn.textContent='Manage';
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit');
            editBtn.textContent = 'Edit';
            const attendanceBtn = document.createElement('button');
            attendanceBtn.classList.add('attendance');
            attendanceBtn.textContent = 'Attendance';
            btnContainer.appendChild(manageBtn);
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(attendanceBtn);

            eventCard.appendChild(infoContainer);
            eventCard.appendChild(btnContainer);
            eventsBody.appendChild(eventCard);
    });
}