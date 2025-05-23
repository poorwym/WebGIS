import "./assets/style.css"
import React, {useState} from 'react';
import CesiumLayer from './components/CesiumLayer'
import FileSelector from "./components/FileSelector.jsx";

function App() {
    const [pointList, setPointList] = useState([]);
    return (
    <div className="w-full h-full">
        <FileSelector setPointList={setPointList} />
        <CesiumLayer pointList={pointList} />
    </div>
  )
}

export default App
