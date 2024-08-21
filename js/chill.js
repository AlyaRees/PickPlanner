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

        // Drag-and-drop functionality for Wave Check Report data
        const waveCheckDropZone = document.getElementById('pt-drop-zone');

        if (waveCheckDropZone) {
            // Adds an event listener on the drop zone element that listens for the 'dragover' event
            waveCheckDropZone.addEventListener('dragover', function(event) {
                event.preventDefault();
                waveCheckDropZone.classList.add('hover');
            });
    
            // Adds event listener for dragleave
            waveCheckDropZone.addEventListener('dragleave', function() {
                waveCheckDropZone.classList.remove('hover');
            });
    
            // Adds an event listener to the waveCheckDropZone element for the 'drop' event
            waveCheckDropZone.addEventListener('drop', function(event) {
                event.preventDefault();
                waveCheckDropZone.classList.remove('hover');
    
                const file = event.dataTransfer.files[0];
    
                if (file && file.name.endsWith('.xlsx')) {
                    const reader = new FileReader();
    
                    reader.onload = function(e) {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                        // Extracting Task Allocated Total Quantity and Task Picked Quantity
                        const lastRow = jsonData[jsonData.length - 1];
    
                        if (lastRow && lastRow.length >= 8) {
                            const taskAllocatedTotalQuantity = formatNumberWithCommas(lastRow[7]);
                            const taskPickedQuantity = formatNumberWithCommas(lastRow[8]);
    
                            if (/^\d+(,\d+)*$/.test(taskAllocatedTotalQuantity) && /^\d+(,\d+)*$/.test(taskPickedQuantity)) {
                                localStorage.setItem('pickTarget', taskAllocatedTotalQuantity);
                                localStorage.setItem('amount-picked-output', taskPickedQuantity);
                                
                                alert(`File processed successfully!`);

                            } else {
                                alert('Invalid data format.');
                            }
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

                    if (lastRow && lastRow.length <= 11) {

                        // Extract the average number of cases picked per hour from the 9th column
                        const averageCasesPerHour = parseFloat(lastRow[8]);
                        if (!isNaN(averageCasesPerHour)) {
                            localStorage.setItem('averageCasesPerHour', averageCasesPerHour);
                        } else {
                            alert('Invalid data format for average cases per hour.');
                            return;
                        }

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

                        setTimeout(() => {
                            window.location.href = 'chill.html';
                        }, 100);

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
    const pickTargetOutput = localStorage.getItem('pickTarget');
    const amountPicked = localStorage.getItem('amount-picked-output');
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
    const averageCasesPerHour = parseFloat(localStorage.getItem('averageCasesPerHour')) || 0;

    if (pickTargetOutput && amountPicked && numberOfEmployees && averageCasesPerHour > 0) {
        const estimatedFinishTime = estimateFinishTime(
            parseInt(numberOfEmployees, 10),
            averageCasesPerHour,
            parseInt(amountPicked, 10),
            parseInt(pickTargetOutput, 10)
        );

        const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
        if (estimatedFinishTimeElement) {
            estimatedFinishTimeElement.textContent = estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    if (pickTargetOutput) {
        const pickTargetElement = document.getElementById('pick-target');
        if (pickTargetElement) {
            pickTargetElement.textContent = pickTargetOutput;
        }
    }

    if (amountPicked) {
        const amountPickedElement = document.getElementById('total-cases-output');
        if (amountPickedElement) {
            amountPickedElement.textContent = amountPicked;
        }
    }

    if (numberOfEmployees) {
        const employeesOutputElement = document.getElementById('employees-output');
        if (employeesOutputElement) {
            employeesOutputElement.textContent = numberOfEmployees;
        }
    }

    if (lastUpdated) {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = lastUpdated;
        }
    }
    
    // Function to estimate the finish time

    function estimateFinishTime(numberOfEmployees, averageCasesPerHour, amountPicked, pickTarget) {

    const totalHoursRequired = pickTarget / averageCasesPerHour;
    const pickingHours = Math.min(totalHoursRequired, 7.5);
    const now = new Date();

    const finishTime = new Date(now.getTime() + totalHoursRequired * 60 * 60 * 1000);
    return finishTime;
}
});