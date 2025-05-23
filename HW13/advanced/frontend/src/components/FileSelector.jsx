import React, {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../assets/style.css"

async function fetchEduFiles(setEduFileList) {
    try {
        const res = await fetch('http://localhost:8000/file/file_edu_poi', {
            method: 'GET',
        })

        if (!res.ok) {
            throw Error("Could not get edu POI file list")
        }
        const json = await res.json()
        console.log(json)
        setEduFileList(json.list)
        console.log("Successfully loaded edu POI file list")
    } catch (err) {
        console.log(err)
    }
}

async function fetchHouseFiles(setHouseFileList) {

    try {
        const res = await fetch('http://localhost:8000/file/file_house_price', {
            method: 'GET',
        })

        if (!res.ok) {
            throw Error("Could not get housr price file list")
        }
        const json = await res.json()
        console.log(json)
        setHouseFileList(json.list)
        console.log("Successfully loaded house price file list")
    } catch (err) {
        console.log(err)
    }
}

async function requestMinMax(selectedEduFile, selectedHouseFile, setPointList){
    if (!selectedEduFile || !selectedHouseFile) {
        alert("请先选择两个文件");
        return;
    }

    try{
        const res = await fetch('http://localhost:8000/calc/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "edu_poi_file_path": selectedEduFile.path,
                "house_price_file_path": selectedHouseFile.path
            })
        })

        const json = await res.json()
        console.log(json)
        setPointList(json.point_list)
    } catch (err){
        console.log(err)
    }
}


function FileSelector({setPointList}) {
    const [eduFileList, setEduFileList] = useState([])
    const [houseFileList, setHouseFileList] = useState([])

    const [selectedEduFile, setSelectedEduFile] = useState(null)
    const [selectedHouseFile, setSelectedHouseFile] = useState(null)

    const handleEduFileChange = (event) => {
        setSelectedEduFile(event.target.value)
    }

    const handleHouseFileChange = (event) => {
        setSelectedHouseFile(event.target.value)
    }

    const  handleClick = () => {
        requestMinMax(selectedEduFile, selectedHouseFile, setPointList)
    }

    useEffect(
        () => {
            fetchEduFiles(setEduFileList)
            fetchHouseFiles(setHouseFileList)
        }, []
    )
    return (
        <div className="w-full flex flex-row p-2">
            <div className="m-2 flex justify-center items-center ">
                <h3 className="font-bold">File Selector</h3>
            </div>
            <div className="w-1/3 h-auto m-2">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">学校数据</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        className="Text-Primary"
                        value={selectedEduFile || ''}
                        label="学校POI文件"
                        color="primary"
                        onChange={handleEduFileChange}
                    >
                        {eduFileList.map(
                            (file, index) => (
                            <MenuItem key={index} value={file}>{file.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="w-1/3 h-auto m-2">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">房价文件</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        className="Text-Primary"
                        value={selectedHouseFile || ''}
                        label="房价文件"
                        color="primary"
                        onChange={handleHouseFileChange}
                    >
                        {houseFileList.map(
                            (file, index) => (
                                <MenuItem key={index} value={file}>{file.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <div className="flex w-1/3 h-auto m-2 justify-center items-center ">
                <Button variant="contained" onClick={handleClick}>计算MinMax指数</Button>
            </div>
        </div>
    );
}

export default FileSelector;