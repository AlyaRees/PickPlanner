// Imports functions from another file
import { estimateFinishTime, instructionBox, clearData, formatNumberWithCommas, showDropDown } from "./main.js";

// Add functionality for data added in desktop version to be successfully updated via the mobile version

// Waits for the entire HTML document to be loaded and parsed before running
document.addEventListener('DOMContentLoaded', function() {

    // Assigns all html element ids to a const variable to be used in the instructionBox function
    const pickTargetHelpIcon = document.getElementById('pt-help-icon');
    const pickPerfHelpIcon = document.getElementById('pp-help-icon');
    const avgCasesPHHelpIcon = document.getElementById('avg-cph-help-icon');
    const pickTargetInstructionBox = document.getElementById('pick-target-instruction-box');
    const pickPerfInstructionBox = document.getElementById('pick-perf-instruction-box');
    const avgCasesInstructionBox = document.getElementById('avg-cph-instruction-box');
    const pickTargetCloseInstructionButton = document.getElementById('pt-close-instruction-box');
    const pickPerfCloseInstructionButton = document.getElementById('pp-close-instruction-box');
    const avgCasesCloseInstructionBox = document.getElementById('avg-cph-instruction-box-close');

    // Assigns the clear data button to variable '...clearDataBtn' 
    const chillClearDataBtn = document.getElementById('chill-clear-data');

    // Initializes an array containing the ids for the local storage of the data input by the user
    const keysToClear = [
        'averageCasesPerHour',
        'numberOfEmployees',
        'amount-picked-output',
        'pickTarget',
        'estimated-finish-time',
        'avg-cases-ph-calc',
        'pickTargetFormatted',
        'amountPickedFormatted',
        'avg-cases-percentage-calc'
    ];
    
    // Attach event listener to the clear data button that listens for a users 'click'
    if (chillClearDataBtn) {
        chillClearDataBtn.addEventListener('click', () => clearData(keysToClear));
    }

    // Uses instructionBox function that shows or hides the instruction box when the help icon is clicked
    instructionBox(pickTargetHelpIcon, pickTargetInstructionBox, pickTargetCloseInstructionButton);
    instructionBox(pickPerfHelpIcon, pickPerfInstructionBox, pickPerfCloseInstructionButton);
    instructionBox(avgCasesPHHelpIcon, avgCasesInstructionBox, avgCasesCloseInstructionBox);

    const editPageSubmitBtn = document.getElementById('submit-data-mobile');
    
    if (editPageSubmitBtn) {
        editPageSubmitBtn.addEventListener('click', function(event) {
            event.preventDefault();

            const pickTargetData = document.getElementById('pick-target-ta').value.trim();
            const casesPerHourData = document.getElementById('cases-ph').value.trim();
            const pickPerfNumOfEmployeesData = document.getElementById('pp-num-employees').value.trim();
            const pickPerfCasesPerHr = document.getElementById('pp-cases-per-hr').value.trim();
            const avgCasesPercentage = document.getElementById('avg-cases-percentage').value.trim();

            let hasError = false; // Flag to track if there's any invalid input
            
            if (pickTargetData === '' && casesPerHourData === '' && pickPerfNumOfEmployeesData === '' && pickPerfCasesPerHr === '' && avgCasesPercentage === '') {
                alert('All fields are empty. Please fill out at least one field.');
                return; // Stop further execution
            }

            if (pickTargetData !== '' && !/^\d+(,\d+)*$/.test(pickTargetData) && isNaN(pickTargetData)) hasError = true;
            if (casesPerHourData !== '' && isNaN(casesPerHourData)) hasError = true;
            if (pickPerfNumOfEmployeesData !== '' && isNaN(pickPerfNumOfEmployeesData)) hasError = true; // Adjust to not allow floats
            if (avgCasesPercentage !== '' && !/^\d+%$/ && isNaN(avgCasesPercentage)) hasError = true;

            if (hasError) {
                alert('Invalid input detected. Please ensure all fields contain valid numbers.');  // Show the error message to the user
                return;  // Exit the function to prevent submission and navigation
            }

            if (pickTargetData !== '') {
                localStorage.setItem('pickTarget', parseInt(pickTargetData.replace(/,/g, '')));
                localStorage.setItem('pickTargetFormatted', formatNumberWithCommas(pickTargetData));
            };
            if (casesPerHourData !== '') {
                localStorage.setItem('cases-ph-output', parseInt(casesPerHourData.replace(/,/g, '')));
                localStorage.setItem('amountPickedFormatted', formatNumberWithCommas(casesPerHourData));
            };
            if (pickPerfNumOfEmployeesData !== '') localStorage.setItem('numberOfEmployees', pickPerfNumOfEmployeesData);
            if (avgCasesPercentage !== '') localStorage.setItem('avg-cases-percentage-calc', avgCasesPercentage);

            const now = new Date();
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            localStorage.setItem('chillLastUpdated', formattedTime);

            calculateAndUpdate();

            window.location.href = 'index.html';

        });
    }

    function calculateAndUpdate() {

        const pickTargetCalc = parseInt(localStorage.getItem('pickTarget')) || 0;
        const casesPerHourCalc = parseInt(localStorage.getItem('amount-picked-output')) || 0;
        const pickPerfNumOfEmployeesCalc = parseFloat(localStorage.getItem('numberOfEmployees')) || 0;
        const pickPerfCasesPerHrCalc = parseFloat(localStorage.getItem('avgCasesPerHourCalc')) || 0;
        const avgCasesPercentageCalc = parseFloat(localStorage.getItem('avg-cases-percentage-calc')) || 0;
    
        if (pickTargetCalc && casesPerHourCalc && pickPerfNumOfEmployeesCalc && pickPerfCasesPerHrCalc && avgCasesPercentageCalc) {
            estimateFinishTime(pickTargetCalc, casesPerHourCalc, pickPerfNumOfEmployeesCalc, pickPerfCasesPerHrCalc, avgCasesPercentageCalc);
        } else {
            alert('Insufficient data to calculate. Please provide more information.');
        }

    }

    const pickTargetOutput = localStorage.getItem('pickTargetFormatted');
    const casesPerHour = localStorage.getItem('amountPickedFormatted');
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

    if (casesPerHour) {
        const casesPerHourElement = document.getElementById('cases-per-hour');
        if (casesPerHourElement) {
            casesPerHourElement.textContent = casesPerHour;
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