// Imports functions from another file
import { instructionBox, formatNumberWithCommas } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    // Assigns all HTML element ids to a const variable to be used in the following instructionBox function
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
        const isDataCleared = !localStorage.getItem('averageCasesPerHourList') &&
                              !localStorage.getItem('averageCasesPerHour') &&
                              !localStorage.getItem('estimated-finish-time') &&
                              !localStorage.getItem('numberOfEmployees') &&
                              !localStorage.getItem('amount-picked-output') &&
                              !localStorage.getItem('pickTarget');

        if (isDataCleared) {
            alert('Data has already been cleared.');
        } else {
            localStorage.removeItem('averageCasesPerHourList');
            localStorage.removeItem('averageCasesPerHour');
            localStorage.removeItem('estimated-finish-time');
            localStorage.removeItem('numberOfEmployees');
            localStorage.removeItem('amount-picked-output');
            localStorage.removeItem('pickTarget');

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
        waveCheckDropZone.addEventListener('dragover', function(event) {
            event.preventDefault();
            waveCheckDropZone.classList.add('hover');
        });

        waveCheckDropZone.addEventListener('dragleave', function() {
            waveCheckDropZone.classList.remove('hover');
        });

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
        pickPerfDropZone.addEventListener('dragover', function(event) {
            event.preventDefault();
            pickPerfDropZone.classList.add('hover');
        });

        pickPerfDropZone.addEventListener('dragleave', function() {
            pickPerfDropZone.classList.remove('hover');
        });

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

                    console.log('Pick Perf JSON data:', jsonData);

                    const lastRow = jsonData[jsonData.length - 1];

                    console.log("lastRow:", lastRow);

                    if (lastRow && lastRow.length <= 11) {
                        const averageCasesPerHour = parseFloat(lastRow[8]);
                        if (!isNaN(averageCasesPerHour)) {
                            let averageCasesList = JSON.parse(localStorage.getItem('averageCasesPerHourList')) || [];
                            console.log("Avg Cases Per Hour List:", averageCasesList);
                            averageCasesList.push(averageCasesPerHour);
                            localStorage.setItem('averageCasesPerHourList', JSON.stringify(averageCasesList));
                            console.log("Avg Cases Per Hour List:", averageCasesList);

                            const totalCases = averageCasesList.reduce((total, num) => total + num, 0);
                            const averageOfAllCases = totalCases / averageCasesList.length;
                            localStorage.setItem('averageCasesPerHour', averageOfAllCases);
                        }

                        const employeeRows = jsonData.filter(row => /^[0-9]{6}@coop\.co\.uk$/.test(row[0]));
                        localStorage.setItem('numberOfEmployees', employeeRows.length);

                        const now = new Date();
                        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                        localStorage.setItem('chillLastUpdated', formattedTime);

                        const pickTargetOutput = localStorage.getItem('pick-target');
                        const amountPicked = localStorage.getItem('amount-picked-output');
                        const numberOfEmployees = localStorage.getItem('numberOfEmployees');
                        const averageOfAllCasesPHour = parseFloat(localStorage.getItem('averageCasesPerHour')) || 0;

                        if (pickTargetOutput && amountPicked && numberOfEmployees && averageOfAllCasesPHour > 0) {
                            const estimatedFinishTime = estimateFinishTime(
                                parseInt(numberOfEmployees, 10),
                                averageOfAllCasesPHour,
                                parseInt(amountPicked.replace(/,/g, ''), 10),
                                parseInt(pickTargetOutput.replace(/,/g, ''), 10)
                            );

                            localStorage.setItem('finishTime', estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                            window.location.href = 'chill.html';
                        }
                        window.location.href = 'chill.html';
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

    function estimateFinishTime(numberOfEmployees, averageOfAllCasesPHour, amountPicked, pickTargetOutput) {
        const pickTargetInt = parseInt(pickTargetOutput.replace(/,/g, ''), 10);
        const remainingCases = pickTargetInt - amountPicked;
        const totalCapacityPerHour = numberOfEmployees * averageOfAllCasesPHour;
        const totalHoursRequired = remainingCases / totalCapacityPerHour;

        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(22, 0, 0, 0);

        const timeRemainingUntilEndOfDay = (endOfDay - now) / (60 * 60 * 1000);
        const pickingHours = Math.min(totalHoursRequired, timeRemainingUntilEndOfDay);
        const estimatedFinishTime = new Date(now.getTime() + pickingHours * 60 * 60 * 1000);
        return estimatedFinishTime;
    }
});

// On the chill.html page, display the estimated finish time and other stored data
document.addEventListener('DOMContentLoaded', function() {

    const pickTargetOutput = localStorage.getItem('pickTarget');
    const amountPicked = localStorage.getItem('amount-picked-output');
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
    const estimatedFinishTime = localStorage.getItem('finishTime');

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