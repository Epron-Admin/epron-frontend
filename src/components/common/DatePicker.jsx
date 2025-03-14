import React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker({value, onChange, label}) {
//   const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        // onChange={(newValue) => {
        //   setValue(newValue);
        // }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}