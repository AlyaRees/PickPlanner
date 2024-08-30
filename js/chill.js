// Imports functions from another file
import { estimateFinishTime, instructionBox, formatNumberWithCommas } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    // Assigns all html element ids to a const variable to be used in the instructionBox function
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

    // Assigns the clear data button to variable 'clearDataBtn' 
    const clearDataBtn = document.getElementById('clear-data');
    
    // Attach event listener to the clear data button that listens for a users 'click'
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearData);
    }

    // Function to clear average cases per hour data from local storage
    function clearData() {

        // isDataCleared checks if each elements local storage is empty
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

    // Uses instructionBox function that shows or hides the instruction box when the help icon is clicked
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
                        // console.log('Wave Check lastRow:', lastRow);
    
                        if (lastRow && lastRow.length >= 8) {
                            const rawPickTarget = lastRow[25];
                            // console.log('Raw Pick Target:', rawPickTarget);
                            const pickTargetFormatted = formatNumberWithCommas(rawPickTarget);
                            // console.log('Pick Target formatted:', pickTargetFormatted);
                            const rawAmountPicked = lastRow[26];
                            // console.log('Raw Amount Picked:', rawAmountPicked);
                            const amountPickedFormatted = formatNumberWithCommas(rawAmountPicked);
                            // console.log('Amount Picked formatted:', amountPickedFormatted);
    
                            // Tests whether pick target and amount picked number match the regex patterns
                            if (/^\d+(,\d+)*$/.test(pickTargetFormatted) && /^\d+(,\d+)*$/.test(amountPickedFormatted)) {

                                // Store values in local storage for use in calculation
                                localStorage.setItem('raw-pick-target', rawPickTarget);
                                // console.log('Raw Pick Target:', rawPickTarget);
                                localStorage.setItem('raw-amount-picked', rawAmountPicked);
                                // Store values to be displayed on chill html in local storage
                                localStorage.setItem('pickTarget', pickTargetFormatted);
                                localStorage.setItem('amount-picked-output', amountPickedFormatted);
                                
                                // Functionality for last updated time
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
                    // console.log('Pick Perf lastRow;', lastRow);

                    if (lastRow && lastRow.length <= 11) {

                        // Extract the average number of cases picked per hour from the 9th column
                        const averageCasesPerHour = parseFloat(lastRow[8]);
                        const avgCasesPHData = averageCasesPerHour;
                        localStorage.setItem('avg-cases-ph-calc', avgCasesPHData);
                        // console.log('Avg cases/hour calc:', avgCasesPerHourCalc);
                        // console.log('Avg cases/hour:', averageCasesPerHour);

                            // Go through each row in the excel file converted to JSON data
                            // return the data from each cell that is a string and matches the regex pattern
                        const employeeRows = jsonData.filter(row => {
                            const firstCell = row[0];
                            return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                        });
                        // console.log('employeeRows:', employeeRows);
                        // console.log('Avg cases/hour:', averageCasesPerHour);
                        // console.log('Raw amountPicked:', amountPicked);
                        // console.log('Raw Pick Target:', rawPickTarget);

                        const numberOfEmployees = employeeRows.length;
                        const numOfEmployeesCalc = numberOfEmployees;
                        localStorage.setItem('num-of-employees-calc', numOfEmployeesCalc);
                        localStorage.setItem('numberOfEmployees', numberOfEmployees);
                        // console.log('Avg cases/hour:', averageCasesPerHour);
                        // console.log('numberOfEmployees:', numberOfEmployees);
                        // console.log('num-of-employees-calc:', numOfEmployeesCalc);

                        // Functionality for getting last updated time
                        const now = new Date();
                        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
                        localStorage.setItem('chillLastUpdated', formattedTime);
                        localStorage.getItem('averageCasesPerHour', averageCasesPerHour);
                        localStorage.setItem('averageCasesPerHour', averageCasesPerHour);
                        // console.log('Avg cases/hour:', averageCasesPerHour);

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

            const avgCasesPerHourCalc = localStorage.getItem('avg-cases-ph-calc');
            // console.log('Avg cases/hour calc:', avgCasesPerHourCalc);
            const rawPickTarget = localStorage.getItem('raw-pick-target');
            console.log('raw Pick Target:', rawPickTarget);
            const rawAmountPicked = localStorage.getItem('raw-amount-picked');
            const numOfEmployeesCalc = localStorage.getItem('num-of-employees-calc');
            // if (isNaN(numOfEmployeesCalc)) {
            //     console.log('Its a string!');
            // } else {
            //     console.log('Its not a string!:', numOfEmployeesCalc);
            // }
            // console.log('Raw Amount Picked:', rawAmountPicked);
            
            estimateFinishTime(rawPickTarget, rawAmountPicked, numOfEmployeesCalc, avgCasesPerHourCalc);

            if (rawPickTarget && rawAmountPicked && numOfEmployeesCalc && avgCasesPerHourCalc > 0) {
                const estimatedFinishTime = estimateFinishTime(
                    rawPickTarget,
                    rawAmountPicked,
                    numOfEmployeesCalc,
                    avgCasesPerHourCalc
                );
            
                const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
                if (estimatedFinishTimeElement) {
                    estimatedFinishTimeElement.textContent = estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            }

        });
    }

    // const editPageSubmitBtnMobile = document.getElementById('submit-data-mobile');
    
    // if (editPageSubmitBtnMobile) {
    //     editPageSubmitBtnMobile.addEventListener('submit', function(event) {
    //         event.preventDefault();
    //         const pickTargetMobile = localStorage.getItem('pick-target-ta').value.trim();
    //         const amountPickedMobile = localStorage.getItem('amount-picked-ta').value.trim();
    //         const pickPerfNumOfEmployeesMobile = localStorage.getItem('pp-num-employees').value.trim();
    //         const pickPerfCasesPerHrMobile = localStorage.getItem('pp-cases-per-hr').value.trim();

    //         // Store the input values in localStorage
    //         if (pickTargetMobile) {
    //             localStorage.setItem('pickTarget', pickTargetMobile);
    //         }
    //         if (amountPickedMobile) {
    //             localStorage.setItem('amount-picked-output', amountPickedMobile);
    //         }
    //         if (pickPerfNumOfEmployeesMobile) {
    //             localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesMobile);
    //         }
    //         if (pickPerfCasesPerHrMobile) {
    //             localStorage.setItem('averageCasesPerHour', pickPerfCasesPerHrMobile);
    //         }

    //         // Optionally redirect to chill.html or another page
    //         window.location.href = 'chill.html';
    //     });
    // }

    const pickTargetOutput = localStorage.getItem('pickTarget');
    const amountPicked = localStorage.getItem('amount-picked-output');
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
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