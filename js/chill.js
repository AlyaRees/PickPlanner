// Imports functions from another file
import { estimateFinishTime, instructionBox, formatNumberWithCommas, showDropDown } from "./main.js";

// Add functionality for data added in desktop version to be successfully updated via the mobile version

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    const menuButton = document.getElementById('menu-bar-btn');
    const dropDownBox = document.getElementById('dd-box');

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

    showDropDown(menuButton, dropDownBox);

    const editPageSubmitBtnMobile = document.getElementById('submit-data-mobile');
    
    if (editPageSubmitBtnMobile) {
        editPageSubmitBtnMobile.addEventListener('click', function(event) {
            event.preventDefault();

            const pickTargetMobileData = document.getElementById('pick-target-ta').value.trim();
            const amountPickedMobileData = document.getElementById('amount-picked-ta').value.trim();
            const pickPerfNumOfEmployeesMobileData = document.getElementById('pp-num-employees').value.trim();
            const pickPerfCasesPerHrMobile = document.getElementById('pp-cases-per-hr').value.trim();

            let hasError = false; // Flag to track if there's any invalid input
            
            if (pickTargetMobileData === '' && amountPickedMobileData === '' && pickPerfNumOfEmployeesMobileData === '' && pickPerfCasesPerHrMobile === '') {
                alert('All fields are empty. Please fill out at least one field.');
                return; // Stop further execution
            }

            if (pickTargetMobileData !== '' && isNaN(pickTargetMobileData)) hasError = true;
            if (amountPickedMobileData !== '' && isNaN(amountPickedMobileData)) hasError = true;
            if (pickPerfNumOfEmployeesMobileData !== '' && isNaN(pickPerfNumOfEmployeesMobileData)) hasError = true;
            if (pickPerfCasesPerHrMobile !== '' && isNaN(pickPerfCasesPerHrMobile)) hasError = true;

            if (hasError) {
                alert('Invalid input detected. Please ensure all fields contain valid numbers.');  // Show the error message to the user
                return;  // Exit the function to prevent submission and navigation
            }

            if (pickTargetMobileData !== '') localStorage.setItem('pickTarget', pickTargetMobileData);
            if (amountPickedMobileData !== '') localStorage.setItem('amount-picked-output', amountPickedMobileData);
            if (pickPerfNumOfEmployeesMobileData !== '') localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesMobileData);
            if (pickPerfCasesPerHrMobile !== '') localStorage.setItem('avgCasesPerHourCalc', pickPerfCasesPerHrMobile);

            const now = new Date();
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            localStorage.setItem('chillLastUpdated', formattedTime);

            calculateAndUpdate();

            window.location.href = 'chill.html';

        });
    }

    function calculateAndUpdate() {

        const pickTargetMobileCalc = parseInt(localStorage.getItem('pickTarget')) || 0;
        const amountPickedMobileCalc = parseInt(localStorage.getItem('amount-picked-output')) || 0;
        const pickPerfNumOfEmployeesMobileCalc = parseFloat(localStorage.getItem('numberOfEmployees')) || 0;
        const pickPerfCasesPerHrMobileCalc = parseFloat(localStorage.getItem('avgCasesPerHourCalc')) || 0;
    
        if (pickTargetMobileCalc && amountPickedMobileCalc && pickPerfNumOfEmployeesMobileCalc && pickPerfCasesPerHrMobileCalc) {
            estimateFinishTime(pickTargetMobileCalc, amountPickedMobileCalc, pickPerfNumOfEmployeesMobileCalc, pickPerfCasesPerHrMobileCalc);
        } else {
            alert('Insufficient data to calculate. Please provide more information.');
        }

    }
    
            // const pickTargetMobile = formatNumberWithCommas(pickTargetMobileData);
            // const amountPickedMobile = formatNumberWithCommas(amountPickedMobileData);
            // const pickPerfNumOfEmployeesMobile = formatNumberWithCommas(pickPerfNumOfEmployeesMobileData);

            // Store the input values in localStorage
            // if (/^\d+(,\d+)*$/.test(pickTargetMobile)) {
            //     localStorage.setItem('pickTarget', pickTargetMobile);
            // }

            // if (/^\d+(,\d+)*$/.test(amountPickedMobile)) {
            //     localStorage.setItem('amount-picked-output', amountPickedMobile);
            // }

            // if (/^\d+(,\d+)*$/.test(pickPerfNumOfEmployeesMobile)) {
            //     localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesMobile);
            // }

            // if (!isNaN(pickPerfCasesPerHrMobileCalc)) {
            //     localStorage.setItem('avgCasesPerHourCalc', pickPerfCasesPerHrMobileCalc);
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