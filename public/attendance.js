import { notify } from "./global.js";

let fullParticipants = [];
let currParticipants = [];
let currFilter = 'nofilter';
async function getParticipantsArray(){
    try{
        const res = await fetch(`/participants-data`);
        const data = await res.json();
        notify(data.message);
        if(data.success){
            fullParticipants = data.participantArray;
            currParticipants = data.participantArray;
            showAttendanceTable(data.participantArray);
        }
    }catch(err){
        console.log(err.message);
        notify(err.message);
    }
}
getParticipantsArray();

function showAttendanceTable(participantArray){
    const attendanceTable = document.getElementById('attendance-table');

    //clearing old table body
    const oldBody = attendanceTable.querySelector('tbody');
    if(oldBody)attendanceTable.removeChild(oldBody);

    const tableBody = document.createElement('tbody');
    tableBody.innerHTML = '';
    let sno = 0

    participantArray.forEach(participant => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add((sno%2==0)?"even":"odd");

        let tableData = document.createElement('td');
        tableData.innerText = `${++sno}`;
        tableRow.appendChild(tableData);

        tableData = document.createElement('td');
        tableData.innerText = participant.name;
        tableRow.appendChild(tableData);

        tableData = document.createElement('td');
        tableData.innerText = participant.regno;
        tableRow.appendChild(tableData);

        tableData = document.createElement('td');
        tableData.innerText = participant.phno;
        tableRow.appendChild(tableData);

        tableData = document.createElement('td');
        tableData.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="${participant.regno}" class="attendance-toggle">
                <span class="slider"></span>
            </label>   
        `;
        tableRow.appendChild(tableData);
        const checkbox = tableData.querySelector('.attendance-toggle');
        checkbox.checked = participant.present;
        checkbox.addEventListener("change", async () => {
            try{
                const res = await fetch('/attendance-trigger',{
                    method:'POST',
                    headers:{ 'Content-Type':'application/json' },
                    body: JSON.stringify({ regno:participant.regno,attendance:checkbox.checked })
                });

                const data = await res.json();
                notify(data.message);
                if(data.success){
                    participant.present = checkbox.checked;
                    const pIndex = fullParticipants.findIndex(p=>p.regno === participant.regno);
                    if(pIndex !== -1)fullParticipants[pIndex].present = checkbox.checked;
                }else{
                    setTimeout(()=>{
                        checkbox.checked = !checkbox.checked;
                    },100);
                }
            }catch(err){
                console.log("Error updating attendance",err.message);
                notify(`Error updating attendance for ${participant.name}(${participant.regno}): ${err.message}`);
            }
        })

        tableBody.appendChild(tableRow);
    })

    attendanceTable.appendChild(tableBody);
}
//search functionality
const searchParticipantsInput = document.getElementById('search-participants-input');
searchParticipantsInput.addEventListener('input',async ()=>{
    const val = searchParticipantsInput.value.toLowerCase().trim();

    const searchedArray = fullParticipants.filter(p => 
        p.name.toLowerCase().includes(val) ||
        p.regno.toLowerCase().includes(val) ||
        p.phno.toLowerCase().includes(val)
    );

    currParticipants = searchedArray;
    applyFilter(currFilter);
})

//filter functionality
const filterIcon = document.getElementById('filter-icon');
let filterIndex = 0;
filterIcon.addEventListener('click',()=>{
    filterIndex=(filterIndex+1)%3;
    const filterArray = ['nofilter','present','absent'];
    applyFilter(filterArray[filterIndex]);
})
function applyFilter(filter){
    currFilter = filter;
    
    let filteredArray = currParticipants;

    if(currFilter == 'nofilter'){
        filterIcon.classList.remove('present');
        filterIcon.classList.remove('absent');
        filterIcon.innerHTML = '<path d="m592-481-57-57 143-182H353l-80-80h487q25 0 36 22t-4 42L592-481ZM791-56 560-287v87q0 17-11.5 28.5T520-160h-80q-17 0-28.5-11.5T400-200v-247L56-791l56-57 736 736-57 56ZM535-538Z"/>';
    }else{
        filterIcon.innerHTML = '<path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>';
        if(currFilter == 'present'){
            filterIcon.classList.add('present');
            filterIcon.classList.remove('absent');
            filteredArray = currParticipants.filter(p => p.present );
        }else{
            filterIcon.classList.add('absent');
            filterIcon.classList.remove('present');
            filteredArray = currParticipants.filter(p => !p.present );
        }
    }

    showAttendanceTable(filteredArray)
}