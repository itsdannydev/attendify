// --------------NOTIFICATIONS--------------
// Notification container
const notficationContainer = document.createElement('div');
notficationContainer.id = "notification-container";
document.body.appendChild(notficationContainer);

function notify(message) {
    //creating new notification div
    const notifications = document.createElement('div');
    notifications.classList.add('notifications');
    notifications.textContent = message;

    //adjusting notification position based on existing notifs
    const previousNotifs = Array.from(notficationContainer.children);
    previousNotifs.forEach(notifElem =>{
        const currBottom = parseFloat(getComputedStyle(notifElem).bottom) || 0; //bottom value of the notif div directly below the new div (the prev notif)
        
        //getting height of current notif, without any visual changes
        notifications.style.position = 'absolute';
        notifications.style.visibility = 'hidden';
        notficationContainer.appendChild(notifications);
        
        const nextHeight = notifications.offsetHeight; //height of current notification div (including padding and spacing)

        notficationContainer.removeChild(notifications); // removed current nottif div so as to facilitate animation

        notifElem.style.bottom = `${currBottom + nextHeight+ 10}px`;
    })

    notficationContainer.appendChild(notifications);
    notifications.style.position = '';
    notifications.style.visibility = '';

    notifications.getBoundingClientRect();

    //not really sure of the requestAnimationFrame's functionality, but its needed for smooth animation
    requestAnimationFrame(() => {
        notifications.classList.add('animate');
    });

    setTimeout(() => {
        requestAnimationFrame(() => {
            notifications.classList.remove('animate');
        });
        setTimeout(()=>{
            notifications.remove();
        },500);
    }, 5000);
}

