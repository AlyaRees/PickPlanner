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

document.addEventListener('DOMContentLoaded', updateTime);