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
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    export function estimateFinishTime(pickTargetNum, amountPickedNum, numOfEmployees, averageCasesPerHour) {

        const remainingCases = pickTargetNum - amountPickedNum;
        const totalCapacityPerHour = numOfEmployees * averageCasesPerHour;
        const totalHoursRequired = remainingCases / totalCapacityPerHour + 0.5;
        
        console.log('Remaining Cases:', remainingCases);
        console.log('Total Capacity Per Hour:', totalCapacityPerHour);
        console.log('Total Hours Required:', totalHoursRequired);
        console.log('Amount Picked:', amountPickedNum);
        console.log('Pick Target Output:', pickTargetNum);
        console.log('Number of Employees:', numOfEmployees);
        console.log('Avg cases/hour:', averageCasesPerHour);
        
        const now = new Date();
        console.log('Current Time:', now.toLocaleTimeString());
    
        const endOfDay = new Date(now);
        console.log('endOfDay:', endOfDay);
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