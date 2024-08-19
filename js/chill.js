// Imports functions from another file
import { instructionBox, formatNumberWithCommas } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {
    
    // Targets the input field on the edit page and assigns it to employeeDataInput
    const employeeDataInput = document.getElementById('employeeData');

    // Adds active blinking cursor to input field on the edit page if it exists
    if (employeeDataInput) {
        employeeDataInput.focus();
    }

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
                        const averagePickRatePerHour = parseFloat(lastRow[8]);
                        const totalCases = formatNumberWithCommas(totalCasesColumn);
                        const amountPicked = `${totalCases}`;

                        if (/^\d+(,\d+)*$/.test(amountPicked)) {
                            localStorage.setItem('amount-picked-output', amountPicked);

                            const pickTarget = parseInt(localStorage.getItem('pickTarget').replace(/,/g, ''), 10);
                            const numOfEmployees = parseInt(localStorage.getItem('numberOfEmployees'), 10);
                            const hoursToPick = 7.5;

                            const estimatedFinishTime = calculateEstimatedFinishTime(
                                pickTarget,
                                numOfEmployees,
                                averagePickRatePerHour,
                                hoursToPick
                            );

                            localStorage.setItem('estimatedFinishTime', estimatedFinishTime);

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

    function calculateEstimatedFinishTime(pickTarget, numEmployees, avgPickRatePerHour, hoursToPick) {
        const totalCasesPerHour = numEmployees * avgPickRatePerHour;
        const requiredHours = pickTarget / totalCasesPerHour;
        const pickingHours = Math.min(requiredHours, hoursToPick);
        const now = new Date();
        const finishTime = new Date(now.getTime() + pickingHours * 60 * 60 * 1000);

        // Extract hours and minutes
        const hours = String(finishTime.getHours()).padStart(2, '0');
        const minutes = String(finishTime.getMinutes()).padStart(2, '0');
        
        // Format time as HH:MM
        return `${hours}:${minutes}`;
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
    const estimatedFinishTime = localStorage.getItem('estimatedFinishTime');

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

    if (estimatedFinishTime) {
        const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
        if (estimatedFinishTimeElement) {
            estimatedFinishTimeElement.textContent = estimatedFinishTime;
        }
    }

    // Handles the submission for pick target input field on the edit_page.html
    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const pickTarget = employeeDataInput.value.trim();
            const numericValue = pickTarget.replace(/,/g, '');

            if (!/^\d+$/.test(numericValue)) {
                alert('Please enter a valid input.');
                return;
            }

            const pickTargetOutput = formatNumberWithCommas(numericValue);
            localStorage.setItem('pickTarget', pickTargetOutput);

            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            localStorage.setItem('chillLastUpdated', formattedTime);

            window.location.href = 'chill.html';
        });
    }
});