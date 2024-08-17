// Imports function named instructionBox from another file
import { instructionBox } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {
    
    // Targets the input field on the edit page and assigns it to employeeDataInput
    const employeeDataInput = document.getElementById('employeeData');

    // Adds active blinking cursor to input field on the edit page if it exists
    if (employeeDataInput) {
        employeeDataInput.focus();
    }

    // Handles function for clicking pick target help icon

    // Assigns all html element ids to a const variable to be used in the following functions
    const pickTargetHelpIcon = document.getElementById('pt-help-icon');
    const pickPerfHelpIcon = document.getElementById('pp-help-icon');
    const pickTargetInstructionBox = document.getElementById('pick-target-instruction-box');
    const pickPerfInstructionBox = document.getElementById('pick-perf-instruction-box');
    const pickTargetCloseInstructionButton = document.getElementById('pt-close-instruction-box');
    const pickPerfCloseInstructionButton = document.getElementById('pp-close-instruction-box')

    // Show or hide the instruction box when the help icon is clicked

    instructionBox(pickTargetHelpIcon, pickTargetInstructionBox, pickTargetCloseInstructionButton);
    instructionBox(pickPerfHelpIcon, pickPerfInstructionBox, pickPerfCloseInstructionButton);

       // Drag-and-drop functionality for pick performance report data

       const dropZone = document.getElementById('drop-zone');

       if (dropZone) {

        // Adds an event listener on the drop zone element 
        //that listens for the 'dragover' event
        // which occurs when the file is dragged over the 'dropZone'
           dropZone.addEventListener('dragover', function(event) {

        // Prevents default browser behavior of not allowing drops in certain areas
               event.preventDefault();

            // Adds a CSS class named 'hover' to dropZone element to visually indicate it is active
               dropZone.classList.add('hover');
           });
   
        // Adds event listener for dragleave which is triggered when the dragged item leaves the dropZone
           dropZone.addEventListener('dragleave', function() {

            // Remove reverts it to default
               dropZone.classList.remove('hover');
           });
           
        // Adds an event listener to the dropZone element
        // This listens for a user dropping a file into the dropZone
           dropZone.addEventListener('drop', function(event) {
               event.preventDefault();
               dropZone.classList.remove('hover');

            // Retrieves the first file from the dataTransfer object (the files dropped)
               const file = event.dataTransfer.files[0];
               
               // If a file was dropped and its name ends in '.xlsx'
            // indicating it is an excel file, then the code inside the block is executed (below)
               if (file && file.name.endsWith('.xlsx')) {

                // new FileReader() creates a new object that can read the contents of the file
                   const reader = new FileReader();

                // Sets up a callback function that runs when the file is successfully read
                   reader.onload = function(e) {

                    // Converts data into a Uint8Array, needed to read the binary content of the excel file
                       const data = new Uint8Array(e.target.result);

                    // Uses the XLSX library to read the file data as an excel workbook
                       const workbook = XLSX.read(data, { type: 'array' });

                    // Retrieves the name of the first sheet in the workbook
                       const sheetName = workbook.SheetNames[0];

                    // Gets the worksheet data from the worksheet
                       const worksheet = workbook.Sheets[sheetName];
   
                    // Converts the worksheet data into a JSON array 
                    // using the XLSX.utils.sheet_to_json method
                    // whereby each row in the worksheet table (ignoring any scattered data) 
                    // becomes an array element
                    // { header: 1 } ensures that the first row is ignored and treated as normal data
                       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
   
                    // Get the last row
                       const lastRow = jsonData[jsonData.length - 1];

                       if (lastRow && lastRow.length >= 6) {
                        const totalCasesColumn = lastRow[5];

                        // Get content of 6th column in last row ('Total Cases' picked)
                        localStorage.setItem('amount-picked-output', totalCasesColumn);

                       // Filter rows to identify employee IDs
                    // row[0] accesses first cell in each row
                    // Checks if the first cell is a string and matches a specific pattern
                    // six digits from 0-9 followed by '@coop.co.uk' (indicating an employee ID)
                    // '===' means both the value and type of the two variables being compared 
                    // must be the same for the expression to return 'true'
                       const employeeRows = jsonData.filter(row => {
                           const firstCell = row[0];
                           return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                       });
   
                    // Calculates the number of employee rows found
                       const numberOfEmployees = employeeRows.length;
   
                       // Store the calculated number of employees
                       localStorage.setItem('numberOfEmployees', numberOfEmployees);

                       // Capture and store the current time as the "Last Updated" time
                       const now = new Date();
                       const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                       localStorage.setItem('chillLastUpdated', formattedTime);
   
                       alert(`File processed successfully!`);

                       setTimeout(() => {
                        window.location.href = 'chill.html';
                       }, 100);
                   } else {
                    alert('The Excel file does not have the expected format.');
                }
            };

                // Initiates the reading of the file as an array buffer
                // This is necessary for processing binary files like excel documents
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please drop a valid Excel (.xlsx) file.');
        }
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
    const totalCases = localStorage.getItem('amount-picked-output');

    if (totalCases) {
        const totalCasesElement = document.getElementById('total-cases-output');
        if (totalCasesElement) {
            totalCasesElement.textContent = totalCases;
        }
    }
    
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