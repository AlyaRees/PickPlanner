// Imports functions from another file
import { estimateFinishTime, instructionBox, formatNumberWithCommas } from "./main.js";

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    const menuBarButton = document.getElementById('menu-bar-btn');

        if (menuBarButton) {
            menuBarButton.addEventListener('hover', showDropDown);
        }
        
    const dropDownBox = document.getElementById('dd-box');

    function showDropDown(dropDownBox) {
        if (dropDownBox) {
            if (dropDownBox.style.display == "flex") {
                dropDownBox.style.display = "none";
            } else {
                dropDownBox.style.display = "flex";
            }
        }
    }

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
    const chillClearDataBtn = document.getElementById('chill-clear-data');
    const ambClearDataBtn = document.getElementById('amb-clear-data');
    const frzClearDataBtn = document.getElementById('frz-clear-data');
    
    // Attach event listener to the clear data button that listens for a users 'click'
    if (chillClearDataBtn) {
        chillClearDataBtn.addEventListener('click', clearData);
    }

    if (ambClearDataBtn) {
        ambClearDataBtn.addEventListener('click', clearData);
    }

    if (frzClearDataBtn) {
        frzClearDataBtn.addEventListener('click', clearData);
    }

    // Function to clear average cases per hour data from local storage
    function clearData() {

        // isDataCleared checks if each elements local storage is empty
        const isDataCleared = !localStorage.getItem('averageCasesPerHour') &&
                          !localStorage.getItem('numberOfEmployees') &&
                          !localStorage.getItem('amount-picked-output') &&
                          !localStorage.getItem('pickTarget') &&
                          !localStorage.removeItem('estimated-finish-time') &&
                          !localStorage.removeItem('avg-cases-ph-calc');

        if (isDataCleared) {
            alert('Data has already been cleared.');
        } else { // Remove the relevant items from local storage
            localStorage.removeItem('averageCasesPerHour');
            localStorage.removeItem('frozenFinishTime');
            localStorage.removeItem('numberOfEmployees');
            localStorage.removeItem('amount-picked-output');
            localStorage.removeItem('pickTarget');
            localStorage.removeItem('estimated-finish-time');
            localStorage.removeItem('avg-cases-ph-calc');

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
                        const avgCasesPerHour = parseFloat(lastRow[8]);
                        // console.log('Avg cases/hour calc:', avgCasesPerHourCalc);
                        console.log('Avg cases/hour 1:', avgCasesPerHour);
                        localStorage.setItem('avgCasesPerHourCalc', avgCasesPerHour);
                        console.log('Avg cases/hour 2:', avgCasesPerHour);

                            // Go through each row in the excel file converted to JSON data
                            // return the data from each cell that is a string and matches the regex pattern
                        const employeeRows = jsonData.filter(row => {
                            const firstCell = row[0];
                            return typeof firstCell === 'string' && /^[0-9]{6}@coop\.co\.uk$/.test(firstCell);
                        });
                        console.log('employeeRows:', employeeRows);
                        // console.log('Raw amountPicked:', amountPicked);
                        // console.log('Raw Pick Target:', rawPickTarget);

                        const numberOfEmployees = employeeRows.length;
                        const numOfEmployeesCalc = numberOfEmployees;
                        localStorage.setItem('num-of-employees-calc', numOfEmployeesCalc);
                        localStorage.setItem('numberOfEmployees', numberOfEmployees);

                        // Functionality for getting last updated time
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

            const rawPickTarget = localStorage.getItem('raw-pick-target');
            // console.log('raw Pick Target:', rawPickTarget);
            const rawAmountPicked = localStorage.getItem('raw-amount-picked');
            const numOfEmployeesCalc = localStorage.getItem('num-of-employees-calc');
            const avgCasesPerHour = localStorage.getItem('avgCasesPerHourCalc');
            console.log('Avg cases 3:', avgCasesPerHour);
            if (isNaN(numOfEmployeesCalc)) {
                console.log('Its a string!');
            } else {
                console.log('Its not a string!:', numOfEmployeesCalc);
            }
            // console.log('Raw Amount Picked:', rawAmountPicked);
            
            estimateFinishTime(rawPickTarget, rawAmountPicked, numOfEmployeesCalc, avgCasesPerHour);

            if (rawPickTarget && rawAmountPicked && numOfEmployeesCalc && avgCasesPerHour > 0) {
                const estimatedFinishTime = estimateFinishTime(
                    rawPickTarget,
                    rawAmountPicked,
                    numOfEmployeesCalc,
                    avgCasesPerHour
                );
            
                const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
                if (estimatedFinishTimeElement) {
                    estimatedFinishTimeElement.textContent = estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            }

        });
    }

    const editPageSubmitBtnMobile = document.getElementById('submit-data-mobile');
    
    if (editPageSubmitBtnMobile) {
        editPageSubmitBtnMobile.addEventListener('click', function(event) {
            event.preventDefault();

            const pickTargetMobileData = document.getElementById('pick-target-ta').value.trim();
            const amountPickedMobileData = document.getElementById('amount-picked-ta').value.trim();
            const pickPerfNumOfEmployeesMobileData = document.getElementById('pp-num-employees').value.trim();
            const pickPerfCasesPerHrMobile = document.getElementById('pp-cases-per-hr').value.trim();

            if (pickTargetMobileData === '' && amountPickedMobileData === '' && pickPerfNumOfEmployeesMobileData === '' && pickPerfCasesPerHrMobile === '') {
                alert('All fields are empty. Please fill out at least one field.');
                return; // Stop further execution
            }

            let hasError = false; // Flag to track if there's any invalid input

            if (pickTargetMobileData !== '' && isNaN(pickTargetMobileData)) {
                    hasError = true;
            }

            if (pickTargetMobileData == 0) {
                hasError = true;
            }

            if (amountPickedMobileData !== '' && isNaN(amountPickedMobileData)) {
                    hasError = true;
                }

                if (amountPickedMobileData == 0) {
                    hasError = true;
                }

            if (pickPerfNumOfEmployeesMobileData !== '' && isNaN(pickPerfNumOfEmployeesMobileData)) {
                    hasError = true;
            }

            if (pickPerfNumOfEmployeesMobileData == 0) {
                hasError = true;
            }

            if (pickPerfCasesPerHrMobile !== '' && isNaN(pickPerfCasesPerHrMobile)) {
                hasError = true;
            }
            
            if (pickPerfCasesPerHrMobile == 0) {
                hasError = true;
            }

            if (hasError) {
                alert('Invalid input detected. Please ensure all fields contain valid numbers.');  // Show the error message to the user
                return;  // Exit the function to prevent submission and navigation
            }

            const pickTargetMobileCalc = parseInt(pickTargetMobileData);
            console.log('pick target mobile:', pickTargetMobileCalc);
            const pickTargetMobile = formatNumberWithCommas(pickTargetMobileData);

            const amountPickedMobileCalc = parseInt(amountPickedMobileData);
            console.log('amount picked mobile:', amountPickedMobileCalc);
            const amountPickedMobile = formatNumberWithCommas(amountPickedMobileData);

            const pickPerfNumOfEmployeesMobileCalc = parseFloat(pickPerfNumOfEmployeesMobileData);
            console.log('num of employees mobile:', pickPerfNumOfEmployeesMobileCalc);
            const pickPerfNumOfEmployeesMobile = formatNumberWithCommas(pickPerfNumOfEmployeesMobileData);
            
            const pickPerfCasesPerHrMobileCalc = parseFloat(pickPerfCasesPerHrMobile);

            // Store the input values in localStorage
            if (/^\d+(,\d+)*$/.test(pickTargetMobile)) {
                localStorage.setItem('pickTarget', pickTargetMobile);
            }

            if (/^\d+(,\d+)*$/.test(amountPickedMobile)) {
                localStorage.setItem('amount-picked-output', amountPickedMobile);
            }

            if (/^\d+(,\d+)*$/.test(pickPerfNumOfEmployeesMobile)) {
                localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesMobile);
            }

            if (!isNaN(pickPerfCasesPerHrMobileCalc)) {
                localStorage.setItem('avgCasesPerHourCalc', pickPerfCasesPerHrMobileCalc);
            }
            
            const now = new Date();
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            localStorage.setItem('chillLastUpdated', formattedTime);
            
            window.location.href = 'chill.html';

            if (pickTargetMobileCalc && amountPickedMobileCalc && pickPerfNumOfEmployeesMobileCalc && pickPerfCasesPerHrMobileCalc) {
                estimateFinishTime(pickTargetMobileCalc, amountPickedMobileCalc, pickPerfNumOfEmployeesMobileCalc, pickPerfCasesPerHrMobileCalc);
            }
        });
    }

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