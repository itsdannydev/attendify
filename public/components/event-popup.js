//global DOM elems
const popupBg = document.getElementById('popup-bg');
const popup = document.getElementById('popup');
const close = document.getElementById('close');
const eventForm = document.getElementById('event-form');

//funcitons
function openPopup(){
    popupBg.classList.remove('hide');
}
function closePopup(){
    popupBg.classList.add('hide');
}
function popupForm(event){
    console.log(event);
    if(!event){
        //create event popup
        eventForm.innerHTML = `
            <h4>Create Event</h4>
            <hr>
            <div>
                <label>
                    <span>Event Title</span>
                    <input id="event-title" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <span>Admin Password</span>
                    <input id="admin-pass" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <span>OC Password</span>
                    <input id="oc-pass" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <span>Email/Phone</span>
                    <input id="contact" class="popup-inputs" type="text" required>
                    <p>*This contact will be used in case you forgot any of the passwords</p>
                </label>
                <button type="submit">CREATE NEW EVENT</button>
            </div>
        `
    }else{
        //edit event popup
        eventForm.innerHTML = `
            <h4>Edit Event event.title</h4>
            <hr>
            <div>
                <label>
                    <span>event.title</span>
                    <input id="event-title" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <span>New Admin Password</span>
                    <input id="admin-pass" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <span>New OC Password</span>
                    <input id="oc-pass" class="popup-inputs" type="text" required>
                </label>
                <label>
                    <p>*Contact of an event can't be edited</p>
                </label>
                <button type="submit">SAVE CHANGES</button>
            </div>
        `
    }
    openPopup();



    
    //Event Listners
    //close popup
    close.addEventListener('click', closePopup);
    popupBg.addEventListener('click',closePopup);
    popup.addEventListener('click',(e)=>{
        e.stopPropagation();
    })
    //input aesthetics
    const popupInputs = document.querySelectorAll('.popup-inputs');
    popupInputs.forEach( input => {
        const popupSpan = input.previousElementSibling;
        function updateState(){
            if(input === document.activeElement || input.value.trim() !== '' ){
                popupSpan.classList.add('activated');
            } else {
                popupSpan.classList.remove('activated');
            }
        }
        input.addEventListener('focus', updateState);
        input.addEventListener('blur', updateState);
        input.addEventListener('input', updateState);
    })
    //form submition
    let isSubmitting = false;
    eventForm.addEventListener('submit',async (e)=>{
        if(isSubmitting)return;
        isSubmitting = true;

        e.preventDefault();

        //inputs
        const eventTitle = document.getElementById('event-title');
        const adminPass = document.getElementById('admin-pass');
        const ocPass = document.getElementById('oc-pass');
        const contact = document.getElementById('contact');

        if(contact){
            //create form logic
            try{
                const res = await fetch('/new-event',{
                    method: "POST",
                    headers:{ 'Content-Type':'application/json'},
                    body:JSON.stringify({
                        eventTitle: eventTitle.value,
                        adminPass: adminPass.value,
                        ocPass: ocPass.value,
                        contact: contact.value
                    })
                })
            
                const data = await res.json();
                if(data.success){
                    notify(`New event "${eventTitle.value}" successfully created!`);
                    closePopup();
                    getEvents();
                } else {
                    notify(`Event Creation Failed: ${data.message} (Server)`);
                }
            }catch(err){
                console.log("Error creating the event",err);
                notify("ERROR CREATING EVENT");
            }finally{
                isSubmitting = false;
            }
        }else{
            //edit form logic
            try{
                const res = await fetch('/edit-event/event.id',{
                    method: "POST",
                    headers:{ 'Content-Type':'application/json'},
                    body:JSON.stringify({
                        eventTitle: eventTitle.value,
                        adminPass: adminPass.value,
                        ocPass: ocPass.value
                    })
                })
            
                const data = await res.json();
                if(data.success){
                    notify(`New event "${eventTitle.value}" successfully created!`);
                    closePopup();
                    getEvents();
                } else {
                    notify(`Event Creation Failed: ${data.message} (Server)`);
                }
            }catch(err){
                console.log("Error creating the event",err);
                notify("ERROR CREATING EVENT");
            }finally{
                isSubmitting = false;
            }
        }
    })
}