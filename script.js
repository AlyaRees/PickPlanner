// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', () => {
    
    // Targets the input field on the edit page and assigns it to employeeDataInput
    const employeeDataInput = document.getElementById('employeeData');

    // Adds active blinking cursor to input field on the edit page if it exists
    if (employeeDataInput) {
        employeeDataInput.focus();
    }

    // Handles function for clicking pick target help icon

    const helpIcon = document.getElementById('help-icon');
    const instructionBox = document.getElementById('pick-target-instruction-box');
    const closeInstructionButton = document.getElementById('close-instruction-box');

    // Show or hide the instruction box when the help icon is clicked
    if (helpIcon) {
        helpIcon.addEventListener('click', function() {

            // Checks if display style property of 'instructionBox' is set to block
            // Meaning that the instruction box is currently visible
            if (instructionBox.style.display === 'block') {
                instructionBox.style.display = 'none';

                // Else if the property in css is not set to 'block'
                // then set it to 'block'
            } else {
                instructionBox.style.display = 'block';
            }
        });
    }

    // Hide the instruction box when the close button is clicked
    if (closeInstructionButton) {
        closeInstructionButton.addEventListener('click', function() {

            // When button is clicked, set the display property to 'none'
            instructionBox.style.display = 'none';
        });
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
                alert('Please enter valid input.');
                return;
            }

            // Store the pick target in localStorage
            localStorage.setItem('pickTarget', pickTarget);

            // Get the current time and format it as "HH:MM"
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

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

    const dropZone = document.getElementById('drop-zone');
    const output = document.getElementById('output');

    // Highlight the drop zone when dragging over it
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('hover');
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuming we are working with the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Extract number of employees from a specific row
            const numberOfEmployees = worksheet['A2'] ? worksheet['A2'].v : 'Not found';
            // Extract average pick rate per hour from a specific cell
            const averagePickRatePerHour = worksheet['B10'] ? worksheet['B10'].v : 'Not found';

            // Update the output with extracted data
            output.innerHTML = `
                <p>Number of Employees: ${numberOfEmployees}</p>
                <p>Average Pick Rate per Hour: ${averagePickRatePerHour}</p>
            `;

            // Optionally, you can also update the textarea with new data
            // document.getElementById('performance-data').value = `Employees: ${numberOfEmployees}\nPick Rate: ${averagePickRatePerHour}`;
        };
        reader.readAsArrayBuffer(file);
    }
});