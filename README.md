# **PickPlanner**  

Welcome to **PickPlanner**!  
An app I am currently developing to help warehouse managers deploy operatives to specific areas in the warehouse more intentionally, increasing their chances of reaching their targets for the shift. PickPlanner allows managers to use data such as performance rates and the number of pickers to make more informed decisions, allowing for time optimization.  

---

## 🚀 **Features**  

- **Desktop version:** With a drag-and-drop interface, pulls data from downloaded Excel and Excel data files.
---
- **Mobile version:** Allows the user to input data through text area interfaces and click **'Submit'**.  
---

## 🎯 **How to Use**  

### General Workflow  
- PickPlanner takes files or data input and extracts relevant data.  
- It processes this data and runs a calculation to produce the **estimated finish time**, indicating when all cases of stock will be picked by warehouse operatives.  
- The required time to pick is based on an 8-hour shift (2 PM–10 PM). The number of hours remaining to pick is calculated as the difference between the data input time and the shift end time (10 PM). This factors into how the estimated finish time is calculated.  
- In the **Desktop version**, you can view the data extracted from the files by opening your browser console after dropping the last file (named "Pick Performance") into the drag-and-drop interface.  

---

### **Use the Desktop Version**  

1. Download the following files (sample data):  
   - [Wave Check Report Sample.xlsx](https://github.com/user-attachments/files/17965175/Wave.Check.Report.Sample.xlsx)  
   - [Pick Performance Report Sample.xlsx](https://github.com/user-attachments/files/17965176/Pick.Performance.Report.Sample.xlsx)  
   *(These files mimic the real file format but contain fake data for privacy reasons.)*  

2. Open **PickPlanner**: [https://alyarees.github.io/PickPlanner/](https://alyarees.github.io/PickPlanner/)  
3. Click **'Add'** in the **Chill** card (the others have not been fully developed yet) to add new data.  
4. Navigate to where the file is stored on your local machine (Windows - Explorer, Mac - Finder).  
5. Drag and drop the **'Wave Check Report'** file, followed by the **'Pick Performance'** file into the interface.  
6. *(Note: Upon your first time using the app, you may need to drag and drop both files a second time for the estimated finish time to be displayed. This is a bug I am working to fix.)*  
7. You should be redirected to the display page with the **estimated finish time** along with other relevant data!  

---

### **Use the Mobile Version (No Downloads Needed)**  

1. Open **PickPlanner** on your desktop/laptop or mobile phone: [https://alyarees.github.io/PickPlanner/](https://alyarees.github.io/PickPlanner/).  
2. Click **Chill**. (If on a desktop/laptop, first resize your browser window until the page switches to a column of three rectangular purple cards: Chill, Ambient, and Frozen.)  
3. Click **'Add'**.  
4. Input the following example data (feel free to input numbers of your own choice):  
   - **Pick target:** `43000`  
   - **Amount picked:** `2000`  
   - **Number of employees:** `19`  
   - **Cases per hour:** `253.08`  

5. Click **'Submit'**.  
6. You will now be redirected to the display page with the **estimated finish time** along with other relevant data!  
7. *(Note: In a real-life scenario, if the number of employees or other data were to change, you can retype and submit the updated numbers. The calculation will update accordingly without needing to clear and re-add all the data.)*  
