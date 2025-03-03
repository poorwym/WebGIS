import React, {useState} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CitySelector(props) {
    
    const handleCityChange = (event) => {
        console.log("Selector:",event.target.value);
        setSelectedCity(event.target.value);
        props.onCityChange(event.target.value);
    };

    const cityList = ["北京", "上海", "广州", "杭州", "深圳"];

    const [selectedCity, setSelectedCity] = useState(props.city);

    return (
        <div className="w-1/2 py-2 my-2" id="city_selector">
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">City</InputLabel>
            <Select
            labelId="demo-simple-select-filled-label"
            className="Text-Primary"
            id='selector'
            value={selectedCity}
            label="Age"
            color="primary"
            onChange={handleCityChange}
            >
            {cityList.map((city, index) => (
                <MenuItem key={index} value={city}>{city}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </div>
    )
}

export default CitySelector
