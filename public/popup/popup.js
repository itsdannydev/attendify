import { createEventTemplate } from "./templates.js";
import { handleCreate, handleEdit, handleAdminAuth, handleAuth } from './popupHandler.js';
import { notify } from "../global.js";
import { getEvents } from "../index.js";

//global DOM elems
const popupBg = document.getElementById('popup-bg');
const popup = document.getElementById('popup');
const close = document.getElementById('close');
const popupForm = document.getElementById('popup-form');

//funcitons
function openPopup(){
    popupBg.classList.remove('hide');
}
export function closePopup(){
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
    popupForm.onsubmit = async (e)=>{
        e.preventDefault();
        
        if(isSubmitting)return;
        isSubmitting = true;

        try{
            switch(type){
                case "create": {
                    const eventTitle = document.getElementById('event-title');
                    const adminPass = document.getElementById('admin-pass');
                    const ocPass = document.getElementById('oc-pass');
                    const contact = document.getElementById('contact');
                    await handleCreate(eventTitle, adminPass, ocPass,contact);
                    break;
                }
                case 'edit':{
                    const eventTitle = document.getElementById('event-title');
                    const adminPass = document.getElementById('admin-pass');
                    const ocPass = document.getElementById('oc-pass');
                    await handleEdit(eventTitle, adminPass, ocPass, event);
                    break;
                }
                case 'adminAuth':{
                    const adminPass = document.getElementById('admin-pass');
                    await handleAdminAuth(adminPass, event);
                    break;
                }
                case 'auth':{
                    const password = document.getElementById('password')
                    await handleAuth(password, event);
                    break;
                }
            }
        }catch(err){
            console.log("Error handling create-popup: ",err.message);
        }finally {
            isSubmitting = false;
        }

    }

    // ----------------------DELETE EVENT----------------------
    const deleteEvent = document.getElementById('delete-event');
    if(deleteEvent){
        deleteEvent.addEventListener('click',async ()=>{
            const confirmed = confirm(`Are you sure you want to delete the event "${event.title}"?\nThis action cannot be reversed`);
            if (!confirmed) return;
            try{
                const res = await fetch('/delete-event',{
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await res.json();
                notify(data.message);
                closePopup();
                getEvents();
            }catch(err){
                console.log("Error Deleting Event: ",err.message);
                notify("Error Deleting Event");
            }
        })
    }
    //-----------------------LOCK ATTENDANCE-----------------------
    const lockAttendance = document.getElementById('lock-attendance');
    if(lockAttendance){
        lockAttendance.addEventListener('click',async ()=>{
            const confirmed = confirm(`Do you want to ${ (event.attendanceLocked)?"unlock":"lock" } the attendance for the event "${event.title}"?`);
            if(!confirmed) return;
            try{
                const res = await fetch('/attendance-lock-toggle',{
                    method: 'POST',
                    headers: { 'Content-Type':'application/json' }
                });

                const data = await res.json();
                notify(data.message);
                if(data.success){
                    closePopup();
                    getEvents();
                }
            }catch(err){
                console.log("Error locking attendance: ",err.message);
                notify("Error Locking Attendance");
            }
        });
    }
    //-----------------------EXPORT AS CSV-----------------------
    const exportCsv = document.getElementById('export-csv');
    if(exportCsv){
        exportCsv.addEventListener('click',async ()=>{
            try{
                const res = await fetch('/export-csv');
                const data = await res.json();
                if(!data.success){
                    notify(data.message);
                    return;
                }
                notify(data.message);

                const blob = new Blob([data.file],{ type:'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const fileName = event.title.replace(/\s+/g,'_');
                a.download = `${fileName}_participants.csv`;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                notify("Successfully exported CSV file");
            }catch(err){
                console.log(err.message);
                notify("Error exporting CSV file");
            }
        });
    }
}