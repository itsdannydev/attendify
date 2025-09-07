import { createEventTemplate } from "./templates.js";
import { handleCreate, handleEdit, handleAdminAuth, handleAuth } from './popupHandler.js';

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
        e.preventDefault();
        
        if(isSubmitting)return;
        isSubmitting = true;

        try{
            //inputs
            const eventTitle = document.getElementById('event-title');
            const adminPass = document.getElementById('admin-pass');
            const ocPass = document.getElementById('oc-pass');
            const contact = document.getElementById('contact');
            const password = document.getElementById('password')

            switch(type){
                case "create": {
                    await handleCreate(eventTitle, adminPass, ocPass,contact);
                    break;
                }
                case 'edit':{
                    await handleEdit(eventTitle, adminPass, ocPass, event);
                    break;
                }
                case 'adminAuth':{
                    await handleAdminAuth(adminPass.value, event);
                    break;
                }
                case 'auth':{
                    await handleAuth(password.value, event);
                    break;
                }
            }
        }catch(err){
            console.log("Error handling create-popup: ",err.message);
        }finally {
            isSubmitting = false;
        }

    })
}