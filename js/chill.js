// Imports functions from another file
import { estimateFinishTime, instructionBox, clearData, formatNumberWithCommas } from "./main.js";

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
        'numberOfEmployees',
        'pickTarget',
        'estimated-finish-time',
        'amountPickedFormatted',
        'cases-ph',
        'amountPicked'
    ];
    
    // Attach event listener to the clear data button that listens for a users 'click'
    if (chillClearDataBtn) {
        chillClearDataBtn.addEventListener('click', () => clearData(keysToClear));
    }

    // Uses instructionBox function that shows or hides the instruction box when the help icon is clicked
    instructionBox(pickTargetHelpIcon, pickTargetInstructionBox, pickTargetCloseInstructionButton);
    instructionBox(pickPerfHelpIcon, pickPerfInstructionBox, pickPerfCloseInstructionButton);
    instructionBox(avgCasesPHHelpIcon, avgCasesInstructionBox, avgCasesCloseInstructionBox);

    const editPageSubmitBtn = document.getElementById('submit-data-btn');
    
    if (editPageSubmitBtn) {
        editPageSubmitBtn.addEventListener('click', function(event) {
            event.preventDefault();

            const pickTargetData = document.getElementById('pick-target-input').value.trim();
            const amountPickedData = document.getElementById('amount-picked-input').value.trim();
            const casesPerHourData = document.getElementById('kpi-input').value.trim();
            const numOfEmployeesData = document.getElementById('num-employees-input').value.trim();

            let hasError = false; // Flag to track if there's any invalid input
            
            if (pickTargetData === '' && casesPerHourData === '' && numOfEmployeesData === '' && amountPickedData === '') {
                alert('All fields are empty. Please fill out at least one field.');
                return; // Stop further execution
            }

            if (pickTargetData !== '' && !/^\d{1,3}(,\d{3})*$/.test(pickTargetData) && isNaN(pickTargetData)) hasError = true;
            if (casesPerHourData !== '' && isNaN(casesPerHourData)) hasError = true;
            if (numOfEmployeesData !== '' && isNaN(numOfEmployeesData)) hasError = true; // Adjust to not allow floats
            if (amountPickedData !== '' && !/^\d{1,3}(,\d{3})*$/.test(amountPickedData) && isNaN(amountPickedData)) hasError = true;

            if (hasError) {
                alert('Invalid input detected. Please ensure all fields contain valid numbers.');  // Show the error message to the user
                return;  // Exit the function to prevent submission and navigation
            }

            if (pickTargetData !== '') {
                localStorage.setItem('pickTarget', parseInt(pickTargetData.replace(/,/g, '')));
            };

            if (amountPickedData !== '') {
                localStorage.setItem('amountPicked', parseInt(amountPickedData.replace(/,/g, '')));
            };

            if (casesPerHourData !== '') {
                localStorage.setItem('cases-ph', parseInt(casesPerHourData));
            };

            if (numOfEmployeesData !== '') localStorage.setItem('numberOfEmployees', numOfEmployeesData);

            const now = new Date();
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
            localStorage.setItem('chillLastUpdated', formattedTime);

            calculateAndUpdate();

            window.location.href = 'index.html';

        });
    }

    function calculateAndUpdate() {

        const pickTargetCalc = parseInt(localStorage.getItem('pickTarget')) || 0;
        const amountPickedCalc = parseInt(localStorage.getItem('amountPicked')) || 0;
        const casesPerHourCalc = parseInt(localStorage.getItem('cases-ph')) || 0;
        const numOfEmployeesCalc = parseFloat(localStorage.getItem('numberOfEmployees')) || 0;
    
        if (pickTargetCalc && amountPickedCalc && numOfEmployeesCalc && casesPerHourCalc) {
            estimateFinishTime(pickTargetCalc, amountPickedCalc, numOfEmployeesCalc, casesPerHourCalc);
        } else {
            alert('Insufficient data to calculate. Please provide more information.');
        }

    }

   const pickTargetCalc = localStorage.getItem('pickTarget');
   const amountPickedCalc = localStorage.getItem('amountPicked');
   const remainingCasesData = pickTargetCalc - amountPickedCalc;
   const volLeftFormatted = formatNumberWithCommas(remainingCasesData);
   localStorage.setItem('volume-left', volLeftFormatted);

    const casesPerHour = localStorage.getItem('cases-ph');
    const numberOfEmployees = localStorage.getItem('numberOfEmployees');
    const lastUpdated = localStorage.getItem('chillLastUpdated');
    const theEstimatedFinishTime = localStorage.getItem('estimated-finish-time');

    if (theEstimatedFinishTime) {
        const estimatedFinishTimeElement = document.getElementById('estimated-finish-time');
        if (estimatedFinishTimeElement) {
            estimatedFinishTimeElement.textContent = theEstimatedFinishTime;
        }
    }

    if (volLeftFormatted) {
        const volumeLeftElement = document.getElementById('volume-left');
        if (volumeLeftElement) {
            volumeLeftElement.textContent = volLeftFormatted;
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

    // Finish this function that will turn the ETF card on index page green or red depending on the time displayed

    // For the placeholder parameters for this function in main.js, use the following: eftSmallCard -> eftCard and theEstimatedFinishTime -> eftVar

    // Fix the uncaught error for when 'theEstimatedFinishTime' is null

    // Fix this: 'if (convertedETF <= cutoffTime)...', eg, it's showing 00:24 as green (because 00 is less than 21), should be red as its later than 21:55.

        function strToTime(theEstimatedFinishTime) {
            let [hours, minutes] = theEstimatedFinishTime.split(":").map(Number);
            return hours * 60 + minutes;
        }

        let convertedETF = strToTime(theEstimatedFinishTime);
        const cutoffTime = 21 * 60 + 55;

        let eftSmallCard = document.querySelector('.small-card:nth-child(3)');

        if (convertedETF <= cutoffTime) {
            eftSmallCard.style.backgroundColor = 'var(--semantic-green)';
        } else {
            eftSmallCard.style.backgroundColor = 'var(--semantic-red)';
        }

    console.log('EFT', typeof theEstimatedFinishTime);
});