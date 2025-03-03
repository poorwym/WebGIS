import React from 'react'
import "../assets/css/style.css"

function LatAndLon(props) {
  return (
    <div className="w-full flex flex-row items-center justify-between my-4 Surface-Secondary rounded-md shadow-md px-4 py-2">
      <h3 className="Text-Primary Font-Title">经度：{props.lat}</h3>
      <h3 className="Text-Primary Font-Title">纬度：{props.lon}</h3>
    </div>
  )
}

export default LatAndLon
