// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {
    
    // Targets the input field on the edit page and assigns it to employeeDataInput
    const employeeDataInput = document.getElementById('employeeData');

    // Adds active blinking cursor to input field on the edit page if it exists
    if (employeeDataInput) {
        employeeDataInput.focus();
    }

    // Handles function for clicking pick target help icon

    const pickTargetHelpIcon = document.getElementById('pt-help-icon');
    const pickPerfHelpIcon = document.getElementById('pp-help-icon');
    const pickTargetInstructionBox = document.getElementById('pick-target-instruction-box');
    const pickPerfInstructionBox = document.getElementById('pick-perf-instruction-box');
    const pickTargetCloseInstructionButton = document.getElementById('pt-close-instruction-box');
    const pickPerfCloseInstructionButton = document.getElementById('pp-close-instruction-box')

    // Show or hide the instruction box when the help icon is clicked

    function showInstructionBox(helpIcon, instructionBox) {
        if (helpIcon) {
            helpIcon.addEventListener('click', function() {
                if (instructionBox.style.display == 'block') {
                    instructionBox.style.display = 'none';
                } else {
                    instructionBox.style.display = 'block';
                }
            });
        }
    }

    showInstructionBox(pickTargetHelpIcon, pickTargetInstructionBox);
    showInstructionBox(pickPerfHelpIcon, pickPerfInstructionBox);


        // Hide the instruction box when the close button is clicked
        if (pickTargetCloseInstructionButton) {
            pickTargetCloseInstructionButton.addEventListener('click', function() {
    
                // When button is clicked, set the display property to 'none'
                pickTargetInstructionBox.style.display = 'none';
            });
        }

        if (pickPerfCloseInstructionButton) {
            pickPerfCloseInstructionButton.addEventListener('click', function() {

                // When button is clicked, set the display property to 'none'
                pickPerfInstructionBox.style.display = 'none';
            });
        }

       // Drag-and-drop functionality for pick performance report data

       const dropZone = document.getElementById('drop-zone');

       if (dropZone) {
           dropZone.addEventListener('dragover', function(event) {
               event.preventDefault();
               dropZone.classList.add('hover');
           });
   
           dropZone.addEventListener('dragleave', function() {
               dropZone.classList.remove('hover');
           });
   
           dropZone.addEventListener('drop', function(event) {
               event.preventDefault();
               dropZone.classList.remove('hover');
   
               const file = event.dataTransfer.files[0];
               if (file && file.name.endsWith('.xlsx')) {
                   const reader = new FileReader();
                   reader.onload = function(e) {
                       const data = new Uint8Array(e.target.result);
                       const workbook = XLSX.read(data, { type: 'array' });
                       const sheetName = workbook.SheetNames[0];
                       const worksheet = workbook.Sheets[sheetName];
   
                       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
   
                       // Filter rows to identify employee IDs
                       const employeeRows = jsonData.filter(row => {
                           const firstCell = row[0];
                           return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                       });
   
                       const numberOfEmployees = employeeRows.length;
   
                       // Store the calculated number of employees
                       localStorage.setItem('numberOfEmployees', numberOfEmployees);

                       // Capture and store the current time as the "Last Updated" time
                       const now = new Date();
                       const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                       localStorage.setItem('chillLastUpdated', formattedTime);
   
                       alert(`File processed successfully!`);
                   };
                   reader.readAsArrayBuffer(file);
               } else {
                   alert('Please drop a valid Excel (.xlsx) file.');
               }
               window.location.href = 'chill.html';
           });
       }

       const numberOfEmployees = localStorage.getItem('numberOfEmployees');
       if (numberOfEmployees) {
           const employeesOutputElement = document.getElementById('employees-output');
           if (employeesOutputElement) {
               employeesOutputElement.textContent = numberOfEmployees;
           }
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
                alert('Please enter a valid input.');
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
});