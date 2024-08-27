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
    const pickTargetInstructionBoxMobile = document.getElementById('pt-instruction-box-mobile');
    const ptHelpIconMobile = document.getElementById('pt-help-icon-mobile');
    const ptCloseInstructionButtonMobile = document.getElementById('pt-instruction-box-mobile-btn-close');
    const ppHelpIconMobile = document.getElementById('pp-help-icon-mobile');
    const ppInstructionBoxMobile = document.getElementById('pp-instruction-box-mobile');
    const ppCloseInstructionBoxMobile = document.getElementById('pp-instruction-box-mobile-btn-close');

    const clearDataBtn = document.getElementById('clear-data');
    
    // Attach event listener to the clear data button
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearData);
    }

    // Function to clear average cases per hour data from local storage
    function clearData() {

        const isDataCleared = !localStorage.getItem('averageCasesPerHour') &&
                          !localStorage.getItem('numberOfEmployees') &&
                          !localStorage.getItem('amount-picked-output') &&
                          !localStorage.getItem('pickTarget') &&
                          !localStorage.removeItem('estimated-finish-time');

        if (isDataCleared) {
            alert('Data has already been cleared.');
        } else { // Remove the relevant items from local storage
            localStorage.removeItem('averageCasesPerHour');
            localStorage.removeItem('frozenFinishTime');
            localStorage.removeItem('numberOfEmployees');
            localStorage.removeItem('amount-picked-output');
            localStorage.removeItem('pickTarget');
            localStorage.removeItem('estimated-finish-time');

            alert('All data has been cleared successfully.');
            window.location.reload();
        }
}

    // Uses function that shows or hides the instruction box when the help icon is clicked
    instructionBox(pickTargetHelpIcon, pickTargetInstructionBox, pickTargetCloseInstructionButton);
    instructionBox(pickPerfHelpIcon, pickPerfInstructionBox, pickPerfCloseInstructionButton);
    instructionBox(ptHelpIconMobile, pickTargetInstructionBoxMobile, ptCloseInstructionButtonMobile);
    instructionBox(ppHelpIconMobile, ppInstructionBoxMobile, ppCloseInstructionBoxMobile);

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
                            const taskAllocatedTotalQuantity = formatNumberWithCommas(lastRow[25]);
                            const rawAmountPicked = lastRow[26];
                            const taskPickedQuantity = formatNumberWithCommas(rawAmountPicked);
    
                            if (/^\d+(,\d+)*$/.test(taskAllocatedTotalQuantity) && /^\d+(,\d+)*$/.test(taskPickedQuantity)) {
                                localStorage.setItem('pickTarget', taskAllocatedTotalQuantity);
                                localStorage.setItem('amount-picked-output', taskPickedQuantity);
                                
                                const now = new Date();
                                const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                                localStorage.setItem('chillLastUpdated', formattedTime);
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
                            // Store the new average in local storage to be used in the calculation
                            localStorage.setItem('averageCasesPerHour', averageCasesPerHour);

                        const employeeRows = jsonData.filter(row => {
                            const firstCell = row[0];
                            return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                        });

                        const numberOfEmployees = employeeRows.length;
                        localStorage.setItem('numberOfEmployees', numberOfEmployees);

                        if (pickTargetOutput && amountPicked && numberOfEmployees && averageCasesPerHour > 0) {
                            const estimatedFinishTime = estimateFinishTime(
                                parseInt(numberOfEmployees, 10),
                                averageCasesPerHour,
                                parseInt(amountPicked.replace(/,/g, ''), 10),
                                parseInt(pickTargetOutput.replace(/,/g, ''), 10)
                            );
                        
                            const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
                            if (estimatedFinishTimeElement) {
                                estimatedFinishTimeElement.textContent = estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                        }

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

            function estimateFinishTime(numberOfEmployees, averageCasesPerHour, amountPicked) {

                const pickTargetInt = parseInt(pickTargetOutput.replace(/,/g, ''), 10);
                const remainingCases = pickTargetInt - amountPicked;
                const totalCapacityPerHour = numberOfEmployees * averageCasesPerHour;
                const totalHoursRequired = remainingCases / totalCapacityPerHour;
                
                console.log('Remaining Cases:', remainingCases);
                console.log('Total Capacity Per Hour:', totalCapacityPerHour);
                console.log('Total Hours Required:', totalHoursRequired);
                console.log('Amount Picked:', amountPicked);
                console.log('Pick Target Output:', pickTargetInt);
                console.log('Number of Employees:', numberOfEmployees);
                console.log('Avg cases/hour:', averageCasesPerHour);
                
                const now = new Date();
                console.log('Current Time:', now.toLocaleTimeString());
            
                const endOfDay = new Date(now);
                endOfDay.setHours(22, 0, 0, 0);
            
                const timeRemainingUntilEndOfDay = (endOfDay - now) / (60 * 60 * 1000);
                console.log('Time Remaining Until End of Day (hours):', timeRemainingUntilEndOfDay);
            
                const pickingHours = Math.min(totalHoursRequired, timeRemainingUntilEndOfDay);
                console.log('Picking Hours:', pickingHours);
            
                const estimatedFinishTime = new Date(now.getTime() + pickingHours * 60 * 60 * 1000);
                console.log('Estimated Finish Time:', estimatedFinishTime.toLocaleTimeString());
            
                localStorage.setItem('estimated-finish-time', estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

                return estimatedFinishTime;
            }

        });
    }

    const editPageSubmitBtnMobile = document.getElementById('submit-data-mobile');
    
    if (editPageSubmitBtnMobile) {
        editPageSubmitBtnMobile.addEventListener('submit', function(event) {
            event.preventDefault();
            const pickTargetMobile = localStorage.getItem('pick-target-ta').value.trim();
            const amountPickedMobile = localStorage.getItem('amount-picked-ta').value.trim();
            const pickPerfNumOfEmployeesMobile = localStorage.getItem('pp-num-employees').value.trim();
            const pickPerfCasesPerHrMobile = localStorage.getItem('pp-cases-per-hr').value.trim();

            // Store the input values in localStorage
            if (pickTargetMobile) {
                localStorage.setItem('pickTarget', pickTargetMobile);
            }
            if (amountPickedMobile) {
                localStorage.setItem('amount-picked-output', amountPickedMobile);
            }
            if (pickPerfNumOfEmployeesMobile) {
                localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesMobile);
            }
            if (pickPerfCasesPerHrMobile) {
                localStorage.setItem('averageCasesPerHour', pickPerfCasesPerHrMobile);
            }

            // Optionally redirect to chill.html or another page
            window.location.href = 'chill.html';
        });
    }

    const pickTargetOutput = localStorage.getItem('pickTarget');
    const amountPicked = localStorage.getItem('amount-picked-output');
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
    const averageCasesPerHour = parseFloat(localStorage.getItem('averageCasesPerHour')) || 0;
    const estimatedFinishTime = localStorage.getItem('estimated-finish-time');

    if (estimatedFinishTime) {
        const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
        if (estimatedFinishTimeElement) {
            estimatedFinishTimeElement.textContent = estimatedFinishTime;
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
});