import React, { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { Grid } from '@mui/material'

const AutocompletePincode = ({ selectedZipcode, setSelectedZipcode, fetchPostOffices, pinCodes, loading }) => {
  return (
    <>
      <Autocomplete
        id='pincodes-autocomplete'
        options={pinCodes}
        getOptionLabel={option => option || ''}
        fullWidth
        value={selectedZipcode}
        renderInput={params => (
          <TextField {...params} value={selectedZipcode} label='Enter your PinCode ' variant='outlined' />
        )}
        onInputChange={(e, newVal) => {
          console.log(newVal)
          setSelectedZipcode(newVal)
          fetchPostOffices(newVal)
        }}
      />
      {loading && <CircularProgress />} {/* Show loading indicator while fetching post offices */}
    </>
  )
}

export default AutocompletePincode
