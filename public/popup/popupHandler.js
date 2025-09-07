import { notify } from '../global.js';
import { getEvents } from '../index.js';
import { closePopup } from './popup.js';

export async function handleCreate(eventTitle, adminPass, ocPass, contact){
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
            notify("ERROR CREATING EVENT")
            console.log(data.message);
        }
    }catch(err){
        console.log("Error creating the event",err);
        notify("ERROR CREATING EVENT");
    }
}

export async function handleEdit(eventTitle, adminPass, ocPass, event){
    try{
        const res = await fetch(`/edit-event/${event.id}`,{
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
            //configuire notify and console.log along with route setup
            notify("ERROR EDITING EVENT");
            console.log(data.message);
        }
    }catch(err){
        console.log("Error creating the event",err);
        notify("ERROR EDITING EVENT");
    }
}

export async function handleAdminAuth(adminPass, event){
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
        notify(`Error verifying admin authentication`);
    }
}

export async function handleAuth(password, event){
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
        notify(`Error verifying authentication`);
    }
}