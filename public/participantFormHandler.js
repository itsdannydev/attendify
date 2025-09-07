import { notify } from "./global.js";

export async function handleAddParticipantForm( participantArray ){
    try{
        const res = await fetch('/add-participants',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ participantArray })
        });

        const data = await res.json();
        notify(data.message);
    }catch(err){
        console.log("Error Adding Participants: ",err.message);
        notify("Error Adding Participants");
    }
}

export async function handleCSV(csvInput) {
    const file = csvInput.files?.[0];
    if(!file){
        return { success:false, message:"No Participants Added: Empty File"}
    }

    try{
        const text = await file.text();
        const aliasMap = {
            timestamp: ["timestamp", "time stamp", "time"],
            name: ["name", "full name", "participant name"],
            regno: ["regno", "reg no", "registration no","registration number"],
            phno: ["phno","phone", "phone no", "phone number"]
        };
        const result = Papa.parse(text,{
            header:true,
            skipEmptyLines:true,
            transformHeader: header =>{
                const lower = header.toLowerCase();
                for(const key in aliasMap){
                    if(aliasMap[key].some(alias => alias.toLowerCase() === lower)){
                        return key;
                    }
                }
                return null;
            }
        })

        return { success:true, participants:result.data, message:"Data extracted from CSV" }
    }catch(err){
        console.log("Error processing CSV: ", err.message);
        return { success:false, message:"Error Adding Participants" };
    }
}
