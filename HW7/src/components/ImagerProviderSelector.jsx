import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { image_provider_source } from '../data/image_provider_source';

function ImagerProviderSelector({option, setOption}) {
  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="imageryProvider-label">Image Provider</InputLabel>
        <Select
          labelId="imageryProvider-label"
          id="imageryProvider-select"
          value={option.imageryProvider}
          label="Image Provider"
          onChange={(e) => setOption({...option, imageryProvider: e.target.value})}
        >
          {Object.keys(image_provider_source).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    </div>
  )
}

export default ImagerProviderSelector
