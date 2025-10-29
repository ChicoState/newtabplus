import React, { useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';







export function MyCalendar3() {
    const [date, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date); // Update the state
        console.log("A new date was selected:", date.toDateString());

    if (date.getDay() === 0 || date.getDay() === 6) { // Check if it's a weekend
        alert("You selected a weekend date!");
      } else {
        alert("You selected a weekday!");
      }
      
    };

    return (
        <div style={{width: "100%", height: "100%"}}>
            <Calendar 
            onChange={handleDateChange} 
            value={setSelectedDate}
            />
            <p>Selected date: {setSelectedDate.toDateString()}</p>
        </div>
    );
}