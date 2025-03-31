import React, { useState } from 'react'
import CitySelector from './CitySelector'
import Title from './Title'
import LatAndLon from './LatAndLon'
import SubmitButton from './SubmitButton'
import Info from './Info'
import useWeather from '../hooks/useWeather'

// 导入css文件
import "../assets/css/styles.css"

// 导入json文件
import weather_image from "../assets/json/weather_image.json"
import cityList from "../assets/json/cityList.json"
import weather_ch_to_en from "../assets/json/weather_ch_to_en.json"

function Weather( {city, setCity} ) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const { weatherData, error, getWeather } = useWeather();
    console.log("WeatherData:", weatherData, "\n Error:", error);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const onCityChange = (city) => {
        setCity(city);
        console.log("City changed to:", city);
        getWeather(city);
    }

    const getWeatherImage = (weather_en) => {
        console.log("Weather_en:", weather_en);
        if (weather_en in weather_image) {
            return weather_image[weather_en].image_path;
        } else {
            return weather_image["other_weather"].image_path;
        }
    }

    const getCityCoordinates = (cityName) => {
        const city = cityList.find(city => city.name === cityName);
        if (city) {
            const [lon, lat] = city.centerPoint.split(',').map(Number);
            return { lat, lon };
        }
        return { lat: 0, lon: 0 };
    }

    const coordinates = getCityCoordinates(city);

    return (
        <div 
            className="w-96 h-auto px-4 py-2 Surface-Primary my-4 mx-4 rounded-md shadow-lg cursor-move" 
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            id="weather-container"
        >
            <div className='w-full flex flex-row items-center justify-between pr-4'>
                <CitySelector city={city} onCityChange={onCityChange}/>
                <Title />
            </div>
            <LatAndLon lat={coordinates.lat.toFixed(2)} lon={coordinates.lon.toFixed(2)} />
            <SubmitButton function={getWeather} city={city}/>
            {weatherData && <Info city={city} icon={getWeatherImage(weather_ch_to_en[weatherData.now.text])} temp={weatherData.now.temperature} weather_en={weather_ch_to_en[weatherData.now.text]} weather_ch={weatherData.now.text} />}
        </div>
    )
}

export default Weather
