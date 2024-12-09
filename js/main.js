// Function to show or hide the instruction box when the help icon is clicked
    
    export function instructionBox(helpIcon, instructionBox, closeInstructionBoxButton) {

        // If the help icon exists, put an event listener on it
        // that waits for the user to 'click' it
        if (helpIcon) {
            helpIcon.addEventListener('click', function() {

                // If the instruction boxes css style display class is set to 'block', set it to 'none'
                // This makes it not visible
                if (instructionBox.style.display == 'block') {
                    instructionBox.style.display = 'none';

                    // Otherwise, set it to 'block' to display it on the page
                } else {
                    instructionBox.style.display = 'block';
                }
            });
        }

        // If the close instruction button exists, put an event listener on it
        if (closeInstructionBoxButton) {
            closeInstructionBoxButton.addEventListener('click', function() {

                // when clicked, set the instruction button css class display to 'none' to hide it
                instructionBox.style.display = 'none';
            });
        }
    }
    
    // Function to format a number with commas
    
    export function formatNumberWithCommas(number) {

        let numberStr = number.toString();

        numberStr = numberStr.replace(/^0+(?=\d)/, '');
        // Convert the numeric value input in the functions parameters to a string
        // Replace searches the string and replaces parts of it according the following pattern
        // In the regex \B matches a position that marks the boundary of a word character inside a word, eg; in 'word'
        // it would match between 'w' and 'o', 'o' and 'r' and 'r' and 'd'.
        // ?= is part of a lookahead assertion that asserts what follows the current position 
        // in the string matches the pattern inside the parentheses
        // \d{3} checks that the position is followed by a group of three digits
        // that is not immediately followed by another digit ?!\d
        // g is the global flag that ensures the replacement is applied to all matches 
        // in the string, not just the first one
        // "," the string to insert at the matched position 
        return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    export function estimateFinishTime(pickTargetNum, amountPickedNum, numOfEmployees, averageCasesPerHour) {

        const remainingCases = pickTargetNum - amountPickedNum;
        const totalCapacityPerHour = numOfEmployees * averageCasesPerHour;
        const breakDurationHours = 0.6; // 30 minute break plus 3 minutes walking time to the canteen and back
        const totalHoursRequired = remainingCases / totalCapacityPerHour + breakDurationHours;
        
        console.log('Remaining Cases:', remainingCases);
        console.log('Total Capacity Per Hour:', totalCapacityPerHour);
        console.log('Total Hours Required:', totalHoursRequired);
        console.log('Amount Picked:', amountPickedNum);
        console.log('Pick Target Output:', pickTargetNum);
        console.log('Number of Employees:', numOfEmployees);
        console.log('Avg cases/hour:', averageCasesPerHour);
        
        const now = new Date();
        console.log('Current Time:', now.toLocaleTimeString());
    
        // Calculate shift end time
        const shiftStartTime = new Date(now);
        shiftStartTime.setHours(14, 0, 0, 0); // Start of the shift at 14:00
    
        const shiftEndTime = new Date(shiftStartTime);
        shiftEndTime.setHours(22, 0, 0, 0); // End of the shift at 22:00
    
        const timeRemainingInShift = (shiftEndTime - now) / (60 * 60 * 1000);
        console.log('Time Remaining in Shift (hours):', timeRemainingInShift);
    
        if (totalHoursRequired <= timeRemainingInShift) {
            // Finish within the shift
            const estimatedFinishTime = new Date(now.getTime() + totalHoursRequired * 60 * 60 * 1000);
            console.log('Estimated Finish Time within Shift:', estimatedFinishTime.toLocaleTimeString());
            localStorage.setItem('estimated-finish-time', estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            return estimatedFinishTime;
        } else {
            // Calculate the actual finish time beyond the shift
            const extraHoursNeeded = totalHoursRequired - timeRemainingInShift;
            const estimatedFinishTime = new Date(shiftEndTime.getTime() + extraHoursNeeded * 60 * 60 * 1000);
            console.log('Estimated Finish Time beyond Shift:', estimatedFinishTime.toLocaleTimeString());
            localStorage.setItem('estimated-finish-time', estimatedFinishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            return estimatedFinishTime;
        }
    }

    export function showDropDown(menuButton, dropDownBox) {

        function toggleDropDown() {

            if (window.innerWidth < 1024) {
            dropDownBox.classList.toggle("show");
        }
    }

        menuButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click from bubbling up
            toggleDropDown();
        });

        document.addEventListener("click", (event) => {
            if (window.innerWidth < 1024 && !dropDownBox.contains(event.target) && !menuButton.contains(event.target)) {
                dropDownBox.classList.remove("show");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 1024) {
                dropDownBox.classList.remove("show");
            }
        });
    }

// Function to clear specific data from local storage
// Takes an empty initialized array called keys
export function clearData(keys = []) {
    // If keys is not an array, using the array attribute (Array.isArray()) or its length is === 0, exit the function
    if (!Array.isArray(keys) || keys.length === 0) {
        console.warn('No keys provided to clearData function.');
        return;
    }

    // clearedKeys is a new array that uses filter and a callback function (key => { ... })  to filter through each value (key) inside the array (keys)
    // If the key exists, its local storage item is removed and it evaluates to true, otherwise (if it doesn't exist) it evaluates to false and the key is excluded from clearedKeys.
    const clearedKeys = keys.filter(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            return true;
        }
        return false;
    });
    // If the function returns true, it is included in the rest of the function.
    // If it returns false, it is excluded.

    // If clearedKeys is already empty (all values false), that means that the .filter() method has returned an empty array
    // And there is no data to be cleared
    if (clearedKeys.length === 0) {
        alert('Data has already been cleared.');
    } else {
        alert(`Data cleared successfully!`);
        window.location.reload(); // Reload the page
    }
}
