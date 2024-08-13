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

// Targets the input field on html and assigns it to employeeDataInput
const employeeDataInput = document.getElementById('employeeData');

// Adds a focus to the element (the blinking cursor inside the input field)
    employeeDataInput.focus();

});

// Adds an event listener that waits for html content to be loaded
// before running specified function
document.addEventListener('DOMContentLoaded', function() {

// Renders the content for pick target on the page (chill.html)

// Fetches content assigned to pick-target id (in html)
// (This data would be the last thing inputted in local storage, which could be null or a integer)
const pickTarget = localStorage.getItem('pickTarget');

// If content matches, render it on the page as text
if (pickTarget) {
    document.getElementById('pick-target').textContent = pickTarget;
}
});

// Handles the submission for pick target input field on edit_page.html 

// Fetches 'inputForm' element from html and puts an event listener on it
// that waits for user to click 'submit' button
// upon submit it executes the following nameless function
document.getElementById('inputForm').addEventListener('submit', function(event) {

// Prevent the form from performing its default action (submitting)
// This allows the custom logic (in this case, validation) to run before 
// deciding whether to submit the form or not
    event.preventDefault();

// Retrieves inputted 'value' from 'employeeData' from <textarea> in <span> on html
// uses 'trim' to remove any whitespace 
// and assigns it to 'pickTarget'
    const pickTarget = document.getElementById('employeeData').value.trim();

// if the input is not in the format of following regular expression

// The entire regular expression explain in depth:

// '!' = not, '/' = start of regular expression, '^' caret is the start of the string,
// '\d' denotes a digit and '\d+' = one or more digits,
// '()' parentheses for treating the sequence as two separate groups
// ',\d+' a comma followed by one or more digits
// '*' zero or more of the preceding element in this case, ',\d+' (a comma followed by one or more digits)
// '$' denotes that the string must end after the last specified element (in this case, a digit)
// '/' at the end denotes the end of the regular expression

// .test is used with regular expression to check whether a string matches its given pattern
    if (!/^\d+(,\d+)*$/.test(pickTarget)) {

// Displays a popup message to the user upon entering a string 
// that does not match the specified pattern
        alert('Please enter a valid number.');
        return;
    }

// References the above function further up (its a loop!)

// If the input data matches the regular expression sequence 
// then fetch data in local storage ('pick-target' assigned to 'pickTarget)
// set the item 'pickTarget' to the newly input data pickTarget
    localStorage.setItem('pickTarget', pickTarget);

// Redirect to the next page (chill.html)
    window.location.href = 'chill.html';
});