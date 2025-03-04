import Weather from './components/Weather'
import Button from '@mui/material/Button'
import { useState } from 'react'
function App() {
  const [showWeather, setShowWeather] = useState(false);
  return (
    <>
      <div className="w-full h-screen">
        <div className="flex flex-row items-center justify-center">
          <Button variant="contained" 
          color="primary" 
          onClick={() => setShowWeather(!showWeather)}>
            {showWeather ? "隐藏组件" : "显示组件"}
          </Button>
        </div>
        <div className="flex flex-wrap items-start justify-start">
          {showWeather && <Weather />}
        </div>
      </div>
    </>
  )
}

export default App
