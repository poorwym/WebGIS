import { useState } from 'react';
import cityList from "../assets/json/cityList.json";

const useWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const getWeather = async (city) => {
        console.log("Getting weather for:", city);
        const KEY = "SBTqyh_01M8c4doi-"; // 请替换为你的Key
        const API = "https://api.seniverse.com/v3/weather/now.json";
        
        const url = `${API}?key=${KEY}&location=${encodeURIComponent(city)}&language=zh-Hans&unit=c`;
        
        console.log("Requesting:", url);
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                setWeatherData(data.results[0]);
                setError(null);
                console.log(data.results[0]);
            } else {
                setError("Invalid response");
                setWeatherData(null);
                console.log("Invalid response");
            }
        } catch (err) {
            setError("Error fetching weather data.");
            setWeatherData(null);
            console.log("Error fetching weather data:", err);
        }
    };

    return { weatherData, error, getWeather };
};

export default useWeather; 