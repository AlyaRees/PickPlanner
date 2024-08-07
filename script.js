// Waits for the entire html document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

// Updates current time on the page
function updateTime() {
    // Uses built-in function to fetch latest date and time
    const now = new Date();
    // Gets hours from 'now', converts this to a string
    // and (padStart) adds '2' zeros ('0') before displayed time
    // and assigns this to 'hours'
    const hours = String(now.getHours()).padStart(2, '0');
    // Does the same as hours above but with minutes
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // Structures the output and assigns it to 'currentTime'
    const currentTime = `${hours}:${minutes}`;
    
    // Gets current-time id from html element
    // and replaces the element with 'textContent' of 'currentTime'
    document.getElementById('current-time').textContent = currentTime;
    // document.getElementById('last-updated').textContent = currentTime;
}

// This calls the updateTime function every minute (1 sec = 1000 , 60 * 1000 = 60000 (1 min)
setInterval(updateTime, 60000);
updateTime();


const pickTarget = localStorage.getItem('pickTarget');
if (pickTarget) {
    document.getElementById('pick-target').textContent = pickTarget;
}
});

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const pickTarget = document.getElementById('employeeData').value.trim();

    localStorage.setItem('pickTarget', pickTarget);

    window.location.href = 'chill.html';
});