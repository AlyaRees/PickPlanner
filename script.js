document.addEventListener('DOMContentLoaded', function() {

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    document.getElementById('current-time').textContent = currentTime;
    // document.getElementById('last-updated').textContent = currentTime;
}

setInterval(updateTime, 1000);
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