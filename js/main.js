// Function to show or hide the instruction box when the help icon is clicked
    
    export function instructionBox(helpIcon, instructionBox, closeInstructionBoxButton) {
        if (helpIcon) {
            helpIcon.addEventListener('click', function() {
                if (instructionBox.style.display == 'block') {
                    instructionBox.style.display = 'none';
                } else {
                    instructionBox.style.display = 'block';
                }
            });
        }

        if (closeInstructionBoxButton) {
            closeInstructionBoxButton.addEventListener('click', function() {
                instructionBox.style.display = 'none';
            });
        }
    }
    
    // Function to format a number with commas
    
    export function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }