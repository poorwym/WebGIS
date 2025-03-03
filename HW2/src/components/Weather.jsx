import React, { useState } from 'react'
import "../assets/css/style.css"
import CitySelector from './CitySelector'
import Title from './Title'
import LatAndLon from './LatAndLon'
import SubmitButton from './SubmitButton'
import Info from './Info'
import "../assets/css/style.css"
import useWeather from './UseWeather'

function Weather() {
    const [city, setCity] = useState("北京");
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

    const weather_image={
        "sunny":{
            image_path:"../public/pictures/sunny.png"
        },
        "cloudy":{
            image_path:"../public/pictures/cloudy.png"
        },
        "rainy":{
            image_path:"../public/pictures/rainny.png"
        },
        "other_weather":{
            image_path:"../public/pictures/otherweather.png"
        }
    }
    const city_weather={
        "北京":{
            lat:116.40,
            lon:39.90,
        },
        "上海":{
            lat:121.47,
            lon:31.23,
        },
        "广州":{
            lat:113.23,
            lon:23.16,
        },
        "杭州":{
            lat:120.19,
            lon:30.26,
        },
        "深圳":{
            lat:114.07,
            lon:22.55,
        }
    }

    const onCityChange = (city) => {
        setCity(city);
        console.log("City changed to:", city);
        getWeather(city);
    }

    const weather_ch_to_en = {
        "晴":"sunny",
        "多云":"cloudy",
        "雨":"rainy",
        "小雨":"rainy",
        "中雨":"rainy",
        "大雨":"rainy",
        "暴雨":"rainy",
        "大暴雨":"rainy",
        "特大暴雨":"rainy",
        "雾":"cloudy",
        "霾":"cloudy",
        "沙尘暴":"cloudy",
        "大风":"cloudy",
        "寒潮":"cloudy",
        "霜冻":"cloudy",
        "冰雹":"rainy",
        "雷阵雨":"rainy",
        "雷阵雨伴有冰雹":"rainy",
        "雨夹雪":"rainy",
        "小雪":"rainy",
        "中雪":"rainy",
        "大雪":"rainy",
        "暴雪":"rainy",
        "浮尘":"cloudy",
        "扬沙":"cloudy",
        "强沙尘暴":"cloudy",
        "龙卷风":"cloudy",
        "飓风":"cloudy",
        "台风":"cloudy",
        "阴":"cloudy",
    }

    const getWeatherImage = (weather_en) => {
        console.log("Weather_en:", weather_en);
        if (weather_en in weather_image) {
            return weather_image[weather_en].image_path;
        } else {
            return weather_image["other_weather"].image_path;
        }
    }

    return (
        <div 
            className="w-1/3 h-auto px-4 py-2 Surface-Primary my-4 mx-4 rounded-md shadow-lg cursor-move" 
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
        >
            <div className='w-full flex flex-row items-center justify-between pr-4'>
                <CitySelector city={city} onCityChange={onCityChange}/>
                <Title />
            </div>
            <LatAndLon lat={city_weather[city].lat} lon={city_weather[city].lon} />
            <SubmitButton function={getWeather} city={city}/>
            {weatherData && <Info city={city} icon={getWeatherImage(weather_ch_to_en[weatherData.now.text])} temp={weatherData.now.temperature} weather_en={weather_ch_to_en[weatherData.now.text]} weather_ch={weatherData.now.text} />}
        </div>
    )
}

export default Weather
