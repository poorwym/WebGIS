import React, {useState} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import cityList from "../assets/json/cityList.json"

function CitySelector(props) {
    
    const handleCityChange = (event) => {
        console.log("Selector:", event.target.value);
        setSelectedCity(event.target.value);
        props.onCityChange(event.target.value);
    };

    const [selectedCity, setSelectedCity] = useState(props.city);

    return (
        <div className="w-1/2 py-2 my-2" id="city-selector-container">
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">城市</InputLabel>
            <Select
            labelId="demo-simple-select-filled-label"
            className="Text-Primary"
            id='city-selector'
            value={selectedCity}
            label="城市"
            color="primary"
            onChange={handleCityChange}
            >
            {cityList.map((city, index) => (
                <MenuItem key={index} value={city.name}>{city.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </div>
    )
}

export default CitySelector
