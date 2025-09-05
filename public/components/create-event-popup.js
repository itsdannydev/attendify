//create event form submition
const createEventForm = document.getElementById('create-event-form');

let isSubmitting = false;
createEventForm.addEventListener('submit',async (e)=>{
    if(isSubmitting)return;
    isSubmitting = true

    e.preventDefault();

    //inputs
    const eventTitle = document.getElementById('event-title');
    const adminPass = document.getElementById('admin-pass');
    const ocPass = document.getElementById('oc-pass');
    const contact = document.getElementById('contact');

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
})
//close popup
const popupBg = document.getElementById('popup-bg');
const popup = document.getElementById('popup');
const close = document.getElementById('close');
close.addEventListener('click', closePopup);
popupBg.addEventListener('click',closePopup);
popup.addEventListener('click',(e)=>{
    e.stopPropagation();
})

//funcitons
function openPopup(){
    popupBg.classList.remove('hide');
}
function closePopup(){
    popupBg.classList.add('hide');
}

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