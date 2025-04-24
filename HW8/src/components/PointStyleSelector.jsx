import React, { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider';
import { ChromePicker } from 'react-color';
import { Color } from 'cesium';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { colorList } from '../data/color_list';

/**
 * 
 * @returns point: {
            pixelSize: 5,
            color: city.name === selectedCity ? Cesium.Color.RED : Cesium.Color.GREEN,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1
            }
 */

function valuetext(value) {
    return `${value}`;
}

function PointStyleSelector( {pointStyle, setPointStyle} ) {
    const [position, setPosition] = useState({ x: 1000, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [pixelSize, setPixelSize] = useState(pointStyle.pixelSize);
    const [color, setColor] = useState(pointStyle.color);
    const [selectedColor, setSelectedColor] = useState(pointStyle.selectedColor);
    const [outlineWidth, setOutlineWidth] = useState(pointStyle.outlineWidth);

    // 当 pointStyle 改变时更新本地状态
    useEffect(() => {
        setPixelSize(pointStyle.pixelSize);
        setColor(pointStyle.color);
        setSelectedColor(pointStyle.selectedColor);
        setOutlineWidth(pointStyle.outlineWidth);
    }, [pointStyle]);

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

    return (
        <div id="point-style-selector" 
            className="w-96 h-auto rounded-md shadow-lg bg-sky-50"
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                userSelect: 'none'
            }}>
            <div 
                className="drag-handle bg-sky-100 p-2 rounded-t-md cursor-move m-2"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                点样式设置
            </div>
            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">像素大小</label>
                    <Slider
                        aria-label="像素大小"
                        value={pixelSize}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={10}
                        onChange={(e, value) => {
                            setPixelSize(value);
                            setPointStyle({...pointStyle, pixelSize: value});
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">轮廓宽度</label>
                    <Slider
                        aria-label="轮廓宽度"
                        value={outlineWidth}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0.1}
                        max={1}
                        onChange={(e, value) => {
                            setOutlineWidth(value);
                            setPointStyle({...pointStyle, outlineWidth: value});
                        }}
                    />
                </div>
                <div className="mb-4">
                    <FormControl fullWidth>
                        <InputLabel id="color-label">颜色</InputLabel>
                        <Select
                            labelId="color-label"
                            value={color}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                setColor(newColor);
                                setPointStyle({...pointStyle, color: newColor});
                            }}
                        >
                            {Object.keys(colorList).map((colorName) => (
                                <MenuItem key={colorName} value={colorName}>{colorName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="mb-4">
                    <FormControl fullWidth>
                        <InputLabel id="selectedColor-label">选中颜色</InputLabel>
                        <Select
                            labelId="selectedColor-label"
                            value={selectedColor}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                setSelectedColor(newColor);
                                setPointStyle({...pointStyle, selectedColor: newColor});
                            }}
                        >
                            {Object.keys(colorList).map((colorName) => (
                                <MenuItem key={colorName} value={colorName}>{colorName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    )
}

export default PointStyleSelector
