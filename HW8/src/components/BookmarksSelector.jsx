import React, { useState } from 'react'
import { Button } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';

function BookmarksSelector({city, setCity}) {
    useEffect(() => {
        console.log("当前城市：", city);
    }, [city]);

    const default_bookmarks = ["杭州市", "北京市", "上海市"]
    
    const [bookmarks, setBookmarks] = useState(default_bookmarks)
    const [selectedBookmark, setSelectedBookmark] = useState("北京市")
    
    const [position, setPosition] = useState({ x: 500, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    const handleBookmarkChange = (e) => {
        const selectedName = e.target.value;
        setSelectedBookmark(selectedName);
        setCity(selectedName);
    };

    const handleAddBookmark = () => {
        if (bookmarks.includes(city)) {
            alert("该城市已存在书签中");
            return;
        }
        alert("添加书签成功");
        setBookmarks([...bookmarks, city])
        setSelectedBookmark(city)
    };

    const handleRemoveBookmark = () => {
        if (!bookmarks.includes(city)) {
            alert("该城市不存在书签中");
            return;
        }
        
        // 保存新的书签列表（移除当前城市）
        const newBookmarks = bookmarks.filter(bookmark => bookmark !== city);
        
        // 更新书签状态
        setBookmarks(newBookmarks);
        
        // 检查剩余书签数量
        if(newBookmarks.length > 0) {
            // 选择下一个书签
            setSelectedBookmark(newBookmarks[0]);
            setCity(newBookmarks[0]);
        }
        
        alert("删除书签成功，剩余书签：" + newBookmarks.length);
    };
    
    return (
        <div id="bookmarks-selector" 
            className="w-96 h-auto rounded-md shadow-lg bg-sky-50 flex flex-col p-2 m-2"
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
                书签选择
            </div>
            <div className="w-full py-2 my-2" id="bookmarks-selector-container">
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">书签</InputLabel>
                <Select
                labelId="demo-simple-select-filled-label"
                className="Text-Primary"
                value={selectedBookmark}
                label="书签"
                color="primary"
                onChange={handleBookmarkChange}
                >
                {bookmarks.map((bookmark, index) => (
                    <MenuItem key={index} value={bookmark}>{bookmark}</MenuItem>
                ))}
                </Select>
                </FormControl>
            </div>
            <div className="flex flex-col gap-2">
            <Button variant="contained" color="primary"  onClick={handleAddBookmark}>
                添加书签
            </Button>
            <Button variant="contained" color="error" onClick={handleRemoveBookmark}>
                    删除书签
            </Button>
            </div>
        </div>
        )
}

export default BookmarksSelector
