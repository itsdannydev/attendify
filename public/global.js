// Notification container
const notficationContainer = document.createElement('div');
notficationContainer.id = "notification-container";
document.body.appendChild(notficationContainer);

function notify(message) {
    const notifications = document.createElement('div');
    notifications.classList.add('notifications');
    notifications.textContent = message;

    const previousNotifs = Array.from(notficationContainer.children);
    previousNotifs.forEach(notifElem =>{
        const currBottom = parseFloat(getComputedStyle(notifElem).bottom) || 0;
        notifications.style.position = 'absolute';
        notifications.style.visibility = 'hidden';
        notficationContainer.appendChild(notifications);
        const nextHeight = notifications.offsetHeight;

        notficationContainer.removeChild(notifications);

        notifElem.style.bottom = `${currBottom + nextHeight+ 10}px`;
    })

    notficationContainer.appendChild(notifications);
    notifications.style.position = '';
    notifications.style.visibility = '';

    notifications.getBoundingClientRect();

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

