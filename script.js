// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {
    // Targets the input field on the edit page and assigns it to employeeDataInput
    const employeeDataInput = document.getElementById('employeeData');

    // Adds active blinking cursor to input field on the edit page if it exists
    if (employeeDataInput) {
        employeeDataInput.focus();
    }

    // Handles the submission for pick target input field on the edit_page.html

    const inputForm = document.getElementById('inputForm');

    // If it exists, add event listener that waits for user to press submit
    if (inputForm) {
        inputForm.addEventListener('submit', function(event) {

            // Prevents default submission, allows logic to be executed beforehand
            event.preventDefault();

            // Retrieves inputted 'value' from 'employeeData', trims any whitespace
            const pickTarget = employeeDataInput.value.trim();

            // Validate the input using a regular expression to allow only comma-separated integers

            // '!' not
            // '/' start of regular expression
            // '^' caret is the start of the string
            // '\d' shorthand for digit
            // '\d+' one or more digits
            // '()' parentheses denote new grouping
            // '*' zero or more of the preceding (in this case, a comma followed by one or more digits)
            // '$' the string must end with the same of the last element (here, this is a digit)
            // '/' closing regular expression
            // .test is used with regular expression to check for a match
            if (!/^\d+(,\d+)*$/.test(pickTarget)) {

                // Displays pop-up to user with following message
                alert('Please enter a valid number.');
                return;
            }

            // Store the pick target in localStorage
            localStorage.setItem('pickTarget', pickTarget);

            // Get the current time and format it as "HH:MM"
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;

            // Store the formatted time as the last updated time
            localStorage.setItem('chillLastUpdated', formattedTime);

            // Redirect to the chill page
            window.location.href = 'chill.html';
        });
    }

    // Renders the content for pick target and last updated time on the chill.html page

    // Fetches data for both variables from local storage
    const pickTarget = localStorage.getItem('pickTarget');
    const lastUpdated = localStorage.getItem('chillLastUpdated');

    // If last updated time exists, render it on the page
    if (lastUpdated) {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {

            // Specifies the data (time) in lastUpdated to be displayed 
            // as text content on html (where the 'id' is named 'last-updated')
            lastUpdatedElement.textContent = lastUpdated;
        }
    }

    // If pick target exists, render it on the page
    if (pickTarget) {

        // Fetches element by 'id' named 'pick-target' on html
        // Assigns it it const variable named 'pickTargetElement'
        const pickTargetElement = document.getElementById('pick-target');

        // Checks it exists
        if (pickTargetElement) {
            
            // If it does, retrieve data under 'pickTarget' from localStorage
            // And display it under the element tag on html (<span id='pick-target'>)
            // stored in the variable (pickTargetElement) as text content
            pickTargetElement.textContent = pickTarget;
        }
    }
});
