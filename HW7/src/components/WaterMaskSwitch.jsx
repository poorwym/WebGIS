import React from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function WaterMaskSwitch({option, setOption}) {
  return (
    <div>
      <FormGroup>
        <FormControlLabel control={<Switch checked={option.waterMask} onChange={(e) => setOption({...option, waterMask: e.target.checked})} />} label="Water Mask" />
      </FormGroup>
    </div>
  )
}

export default WaterMaskSwitch
