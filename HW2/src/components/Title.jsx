import React from 'react'
import "../assets/css/style.css"

function Title() {
  return (
    <div className="w-1/2 h-auto flex flex-row items-center justify-end">
        <h1 className="Text-Primary Font-H1">实时天气</h1>
        {console.log("title")}
    </div>
  )
}

export default Title
