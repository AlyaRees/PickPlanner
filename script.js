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

// Extracts, processes and displays number of employees from inputted excel data

// Gets pasted data from textarea form id="excelForm" from html
// Adds event listener for submit button (<button type="submit"...) to run the function
document.getElementById('excelForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Gets input data (.value) from <textarea id="excelData"...
    // assigns it to name 'data' 
    // and .trim() removes whitespace from both sides of a string
    const data = document.getElementById('excelData').value.trim();
    const rows = data.split('/n');
    const rowCount = rows.length;

    localStorage.setItem('rowCount', rowCount);

    window.location.href = 'chill.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const rowCount = localStorage.getItem('rowCount');
    document.getElementById('rowCount').textContent = rowCount;
});
