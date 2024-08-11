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

// Handles the form submission on edit page

const pickTarget = localStorage.getItem('pickTarget');
if (pickTarget) {
    document.getElementById('pick-target').textContent = pickTarget;
}
});

document.addEventListener('DOMContentLoaded', function() {
    const employeeDataInput = document.getElementById('employeeData');
    employeeDataInput.focus();
});

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const pickTargetInput = document.getElementById('employeeData');
    const pickTarget = pickTargetInput.value.trim();

// if the input is not in the format of following regular expression

// The entire regular expression explain in depth:

// '!' = not, '/' = start of regular expression, '^' caret is the start of the string,
// '\d' denotes a digit and '\d+' = one or more digits,
// '()' parentheses for treating the sequence as two separate groups
// ',\d+' a comma followed by one or more digits
// '*' zero or more of the preceding element in this case, ',\d+'
// '$' denotes that the string must end after the last specified element (in this case, a digit)
// '/' at the end denotes the end of the regular expression

// .test is used with regular expression to check whether a string matches its given pattern
    if (!/^\d+(,\d+)*$/.test(pickTarget)) {

// Displays a popup message to the user upon entering a string 
// that does not match the specified pattern
        alert('Please enter a valid number.');
        return;
    }

    localStorage.setItem('pickTarget', pickTarget);

    window.location.href = 'chill.html';
});