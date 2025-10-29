import React, { useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import DatePicker from 'react-date-picker';


export function MyCalendar6() {
    const [date, setDate] = useState(new Date());

    const onDateChange=(newDate)=>{
        //
        props.handleOnclick(newDate);
        onChange(newDate);
    };

        
    return (

        <div style={{width: "100%", height: "100%"}}>
            <Calendar onChange={setDate}
            value={date} 
            />
        </div>
    );
}