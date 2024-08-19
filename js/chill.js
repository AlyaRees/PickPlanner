// Imports functions from another file
import { instructionBox, formatNumberWithCommas } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    // Assigns all html element ids to a const variable to be used in the following functions
    const pickTargetHelpIcon = document.getElementById('pt-help-icon');
    const pickPerfHelpIcon = document.getElementById('pp-help-icon');
    const pickTargetInstructionBox = document.getElementById('pick-target-instruction-box');
    const pickPerfInstructionBox = document.getElementById('pick-perf-instruction-box');
    const pickTargetCloseInstructionButton = document.getElementById('pt-close-instruction-box');
    const pickPerfCloseInstructionButton = document.getElementById('pp-close-instruction-box');

    // Uses function that shows or hides the instruction box when the help icon is clicked
    instructionBox(pickTargetHelpIcon, pickTargetInstructionBox, pickTargetCloseInstructionButton);
    instructionBox(pickPerfHelpIcon, pickPerfInstructionBox, pickPerfCloseInstructionButton);

    // Drag-and-drop functionality for pick performance report data
    const pickPerfDropZone = document.getElementById('pp-drop-zone');

    if (pickPerfDropZone) {
        // Adds an event listener on the drop zone element that listens for the 'dragover' event
        pickPerfDropZone.addEventListener('dragover', function(event) {
            event.preventDefault();
            pickPerfDropZone.classList.add('hover');
        });

        // Adds event listener for dragleave
        pickPerfDropZone.addEventListener('dragleave', function() {
            pickPerfDropZone.classList.remove('hover');
        });

        // Adds an event listener to the pickPerfDropZone element for the 'drop' event
        pickPerfDropZone.addEventListener('drop', function(event) {
            event.preventDefault();
            pickPerfDropZone.classList.remove('hover');

            const file = event.dataTransfer.files[0];

            if (file && file.name.endsWith('.xlsx')) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    const lastRow = jsonData[jsonData.length - 1];

                    if (lastRow && lastRow.length >= 9) {
                        const totalCasesColumn = lastRow[5];
                        const totalCases = formatNumberWithCommas(totalCasesColumn);
                        const amountPicked = `${totalCases}`;

                        if (/^\d+(,\d+)*$/.test(amountPicked)) {
                            localStorage.setItem('amount-picked-output', amountPicked);

                            setTimeout(() => {
                                window.location.href = 'chill.html';
                            }, 100);
                        } else {
                            alert(`Unable to format output`);
                        }

                        // Additional processing
                        const employeeRows = jsonData.filter(row => {
                            const firstCell = row[0];
                            return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                        });

                        const numberOfEmployees = employeeRows.length;
                        localStorage.setItem('numberOfEmployees', numberOfEmployees);

                        const now = new Date();
                        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                        localStorage.setItem('chillLastUpdated', formattedTime);

                        alert(`File processed successfully!`);
                    } else {
                        alert('The Excel file does not have the expected format.');
                    }
                };

                reader.readAsArrayBuffer(file);
            } else {
                alert('Please drop a valid Excel (.xlsx) file.');
            }
        });
    }
    
    // Retrieve and display the number of employees
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    
    if (numberOfEmployees) {
        const employeesOutputElement = document.getElementById('employees-output');
        if (employeesOutputElement) {
            employeesOutputElement.textContent = numberOfEmployees;
        }
    }

    // Display stored data for pick target and last updated time
    const pickTargetOutput = localStorage.getItem('pickTarget');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
    const amountPicked = localStorage.getItem('amount-picked-output');

    if (amountPicked) {
        const amountPickedElement = document.getElementById('total-cases-output');
        if (amountPickedElement) {
            amountPickedElement.textContent = amountPicked;
        }
    }

    if (lastUpdated) {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = lastUpdated;
        }
    }

    if (pickTargetOutput) {
        const pickTargetElement = document.getElementById('pick-target');
        if (pickTargetElement) {
            pickTargetElement.textContent = pickTargetOutput;
        }
    }
});