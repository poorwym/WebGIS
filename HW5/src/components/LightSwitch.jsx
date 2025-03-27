import React from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


function LightSwitch({option, setOption}) {
  return (
    <div>
      <FormGroup>
        <FormControlLabel control={<Switch defaultChecked={option.lighting} onChange={(e) => setOption({...option, lighting: e.target.checked})} />} label="Lighting" />
        </FormGroup>
    </div>
  )
}

export default LightSwitch
