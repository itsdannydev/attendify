export function createEventTemplate(type,event){
    switch(type){
        case "create":{
            //create event popup
            return `
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

            break;
        }
        case "edit":{
            //edit event popup
            return `
                <h4>Editing: ${event.title}</h4>
                <hr>
                <div>
                    <label>
                        <span>${event.title}(Optional)</span>
                        <input id="event-title" class="popup-inputs" type="text">
                    </label>
                    <label>
                        <span>New Admin Password(Optional)</span>
                        <input id="admin-pass" class="popup-inputs" type="text">
                    </label>
                    <label>
                        <span>New OC Password(Optional)</span>
                        <input id="oc-pass" class="popup-inputs" type="text">
                    </label>
                    <label>
                        <input disabled class="popup-inputs" type="text" value="*Contact of an event can't be edited">
                    </label>
                </div>
                <button type="submit">SAVE CHANGES</button>
            `
            
            break;
        }
        case "adminAuth":{
            //verify admin login
            return `
                <h4>Admin Authentication</h4>
                <hr>
                <div>
                    <label>
                        <span>Admin Password</span>
                        <input id="admin-pass" class="popup-inputs" type="text" required>
                    </label>
                    
                </div>
                <button type="submit">VERIFY</button>
            `

            break;
        }
        case "auth":{
            //authentication
            return `
                <h4>Authentication</h4>
                <hr>
                <div>
                    <label>
                        <span>Enter Password</span>
                        <input id="password" class="popup-inputs" type="text" required>
                    </label>
                </div>
                <button type="submit">VERIFY</button>
            `
        }
    }
}