import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [value, onChange] = useState(new Date());

  const handleDateChange = (newDate) => {
    onChange(newDate); // Update the calendar's internal state
    console.log('Selected date:', newDate);
    // Implement your custom logic here based on the newDate
    // For example, fetch events for this date, update a form, etc.
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={value}
      />
      <p>Current selected date: {value.toDateString()}</p>
    </div>
  );
}

export default MyCalendar;