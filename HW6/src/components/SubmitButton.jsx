import React from 'react'
import Button from '@mui/material/Button';


function SubmitButton(props) {
  return (
    <div>
      <Button variant="contained" 
      className=" w-full bg-blue-500 Text-Primary p-2 rounded" 
      id="submit_button" 
      onClick={() => props.function(props.city)}>
        生成天气小组件
      </Button>
    </div>
  )
}

export default SubmitButton
