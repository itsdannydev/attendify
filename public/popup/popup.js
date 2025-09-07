import { notify } from '../global.js'
import { createEventTemplate } from "./templates.js";

//global DOM elems
const popupBg = document.getElementById('popup-bg');
const popup = document.getElementById('popup');
const close = document.getElementById('close');
const popupForm = document.getElementById('popup-form');

//funcitons
function openPopup(){
    popupBg.classList.remove('hide');
}
function closePopup(){
    popupBg.classList.add('hide');
    popupForm.innerHTML='';
}
export function showPopup(type,event){
    popupForm.innerHTML = createEventTemplate(type,event);

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
    //--------------------FORM SUBMITION--------------------
    let isSubmitting = false;
    popupForm.addEventListener('submit',async (e)=>{
        if(isSubmitting)return;
        isSubmitting = true;

        e.preventDefault();


        switch(type){
            case "create":{
                //create form logic

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

                break;
            }
            case "edit":{
                //edit form logic

                //inputs
                const eventTitle = document.getElementById('event-title');
                const adminPass = document.getElementById('admin-pass');
                const ocPass = document.getElementById('oc-pass');

                try{
                    const res = await fetch(`/edit-event/${type.id}`,{
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
                        notify(data.message);
                    }
                }catch(err){
                    console.log("Error creating the event",err);
                    notify("ERROR CREATING EVENT");
                }finally{
                    isSubmitting = false;
                }

                break;
            }
            case "adminAuth":{
                //admin authentication logic
                //input
                const adminPass = document.getElementById('admin-pass')

                try{
                    const res = await fetch('/adminAuth',{
                        method:"POST",
                        headers:{ 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            adminPass: adminPass.value,
                            eventId: event.id
                        })
                    })

                    const data = await res.json();
                    if(data.success){
                        notify(data.message);
                        setTimeout(()=>{
                            notify(data.message2);
                        },1000);
                        closePopup();
                    }else{
                        console.log(data.message);
                        notify(data.message);
                    }
                }catch(err){
                    console.log('Error verifying admin authentication: ',err.message);
                    notify(`Error verifying admin authentication: ${err.message}`);
                }finally{
                    isSubmitting = false;
                }

                break;
            }
            case "auth":{
                //authentication logic

                //input
                const password = document.getElementById('password')

                try{
                    const res = await fetch('/auth',{
                        method:"POST",
                        headers:{ 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            password: password.value,
                            eventId: event.id
                        })
                    })

                    const data = await res.json();
                    if(data.success){
                        notify(data.message);
                        setTimeout(()=>{
                            notify(data.message2);
                        },1000);
                        closePopup();
                    }else{
                        console.log(data.message);
                        notify(data.message);
                    }
                }catch(err){
                    console.log('Error verifying authentication: ',err.message);
                    notify(`Error verifying authentication: ${err.message}`);
                }finally{
                    isSubmitting = false;
                }

                break;
            }
        }

    })
}