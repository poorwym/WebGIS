import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { terrain_provider_source } from '../data/terrain_provider_source';

function TerrainProviderSelector({option, setOption}) {
  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="terrainProvider-label">Terrain Provider</InputLabel>
        <Select
          labelId="terrainProvider-label"
          id="terrainProvider-select"
          value={option.terrainProvider}
          label="Terrain Provider"
          onChange={(e) => setOption({...option, terrainProvider: e.target.value})}
        >
          {Object.keys(terrain_provider_source).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    </div>
  )
}

export default TerrainProviderSelector
