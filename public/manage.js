import { handleAddParticipantForm, handleCSV } from "./participantFormHandler.js";
import { notify } from "./global.js";

const uploadCSV = document.getElementById('upload-csv');
const manualEntry = document.getElementById('manual-entry');
const backgroundBlob = document.getElementById('background-blob');
const csvInputDiv = document.getElementById('csv-input-div');
const manualInputDiv = document.getElementById('manual-input-div');

//Form inputs
const csvInput = document.getElementById('csv');
const nameInput = document.getElementById('name');
const regnoInput = document.getElementById('regno');
const phnoInput = document.getElementById('phno');

manualEntry.addEventListener('click',()=>{
    toggleAnimation("manual");
    csvInputDiv.classList.add('hide');
    manualInputDiv.classList.remove('hide');

    nameInput.required = true;
    regnoInput.required = true;
    phnoInput.required = true;
    csvInput.required = false;
})
uploadCSV.addEventListener('click',()=>{
    toggleAnimation("csv");
    csvInputDiv.classList.remove('hide');
    manualInputDiv.classList.add('hide');

    nameInput.required = false;
    regnoInput.required = false;
    phnoInput.required = false;
    csvInput.required = true;
})
function toggleAnimation(dir){
    if(dir=="csv"){
        backgroundBlob.classList.remove('right');
        backgroundBlob.classList.add('left');
    }else if(dir=="manual"){
        backgroundBlob.classList.remove('left');
        backgroundBlob.classList.add('right');
    }
}

//form submition
const participantForm = document.getElementById('participant-form');
participantForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    
    let participants;
    if(csvInput.value){
        let result = await handleCSV(csvInput);
        if(!result.success){
            notify(result.message);
            return
        }else{
            participants = result.participants;
            notify(result.message);
        }
    }else{
        participants = [{
            name: nameInput.value,
            regno: regnoInput.value,
            phno: phnoInput.value
        }]
    }
    await handleAddParticipantForm(participants);
    participantForm.reset();
})