import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendarWithViewLogic() {
  const [value, onChange] = useState(new Date());

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    console.log('Active start date changed:', activeStartDate);
    console.log('Current view:', view);
    // Implement custom logic based on view changes
  };

  return (
    <Calendar
      onChange={onChange}
      value={value}
      onActiveStartDateChange={handleActiveStartDateChange}
    />
  );
}

export default MyCalendarWithViewLogic;