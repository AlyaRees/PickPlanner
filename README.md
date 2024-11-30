# **PickPlanner**

Welcome to **PickPlanner**! An app I am currently developing to help warehouse managers deploy operatives to specific areas in the warehouse more intentionally, increasing their chances of reaching their targets for the shift. PickPlanner allows managers to use data such as performance rates and number of pickers to make more informed decisions allowing for time optimisation.

---

## 🚀 **Features**
- **Desktop version:** With drag and drop interface, pulls data from downloaded excel and excel data files.
  
- **Mobile version:** Allows the user to input data through textarea interfaces, click 'submit'. 

---

## 🎯 **How to Use**

- PickPlanner takes files or data input and extracts relevant data
- It then processes this data and runs a calculation to produce the **estimated finish time** that all cases of stock will be picked by warehouse operatives
- The required time to pick is based on an 8 hour shift running from 2pm-10pm, therefore the number of hours remaining to pick is the difference between the time the data was input and the end time of the shift (10pm). This factors into how the estimated finish time is calculated.
- You can view the data extracted from the files when using the desktop version by opening your browser console after dropping the last file (named 'Pick Performance') into the drag and drop interface.

### Use the **Desktop** version
1. Download the following files (sample data)
   [Wave Check Report Sample.xlsx](https://github.com/user-attachments/files/17965175/Wave.Check.Report.Sample.xlsx) and
   [Pick Performance Report Sample.xlsx](https://github.com/user-attachments/files/17965176/Pick.Performance.Report.Sample.xlsx)
The above file format is based on real data file format however the data itself is not real and has been repalced with fake data for priacy reasons.
2. Open **PickPlanner**. ( https://alyarees.github.io/PickPlanner/ )
3. Click **'Add'** in the **Chill** card (the others have not been fully developed yet) to add new data.
4. Navigate to where the file is stored on your local machine (Windows - explorer and Mac - Finder)
5. Drag and drop the **'Wave Check report'** file and then the **'Pick Performance'** file into the interface.
6. (Note: Upon your first time using the app you may have to drag and drop both files a second time for the estimated finish time to be displayed - this is a bug I am working to fix).
7. You should be redirected onto the display page with the **estimated finish time** along with other relevant data!

To place the example data numbers on their own new lines for better readability, you can format the section as follows:

---

### Use the **Mobile** version **(No need to download anything)**

1. Open **PickPlanner** on your desktop/laptop or mobile phone. ( https://alyarees.github.io/PickPlanner/ )
2. Click **Chill** or if using your desktop/laptop, first reduce your window size until the page changes to display a column of 3 rectangular purple cards (Chill, Ambient and Frozen).
3. Click **'Add'**
4. Input the following example data (feel free to input any numbers of your own choice!):

   - **Pick target:** `43000`  
   - **Amount picked:** `2000`  
   - **Number of employees:** `19`  
   - **Cases per hour:** `253.08`  

5. Click **'Submit'**
6. You will now be redirected to the display page with the **estimated finish time** along with other relevant data!
7. *(Note: In a real-life scenario, if the number of employees or other data were to change, the user can always add, retype, and submit the new number and the calculation will update accordingly without having to clear and re-add all the data again at once.)*

---

## 📸 **Screenshots**

![PickPlanner Home](#)
*The user-friendly home screen that keeps you on track.*

![Planning Interface](#)
*The simple and efficient interface for all your planning needs.*


---

Let me know if you'd like specific edits, visual elements, or branding adjustments for this README.
