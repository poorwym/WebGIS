import React from 'react'

function Info(props) {
  return (
    <div className="w-full flex flex-row items-center justify-between my-2 Surface-Secondary rounded-md shadow-md px-4 py-2" id="info-container">
        <div className="w-1/2 flex flex-row items-center justify-between mx-2">
            <img src={props.icon} alt="weather icon" />
            <div className="flex flex-col items-start justify-between mx-2">
                <h3 className="Text-Primary Font-Title my-0">{props.temp}°C</h3>
                <h4 className="Text-Primary Font-Subtitle my-0">{props.weather_en}</h4>
                <h5 className="Text-Primary Font-Body my-0">{props.weather_ch}</h5>
            </div>
        </div>
        <div className="w-1/2 flex flex-row items-center justify-end ml-20">
            <h1 className="Text-Primary Font-H1">{props.city}</h1>
        </div>
    </div>
  )
}

export default Info
