import React, { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { Grid, TextField } from '@mui/material'
import { CountryRegionData } from '../../../../data/regions'
import Box from '@mui/material/Box'

const CountryRegionDropdown = ({
  selectedCountry,
  setSelectedCountry,
  selectedCountryObject,
  setSelectedCountryObject,
  setSelectedRegion
}) => {
  var [defaultCountry, setDefaultCountry] = useState(getContryObjectBycountry(selectedCountry))
  var [countriesWithRegions, setCountriesWithRegions] = useState([])

  function getContryObjectBycountry(country) {
    const countryObj = parseCountryRegionData().find(countryObj => countryObj.country === country) || ''
    // console.log('countryObj', countryObj)
    return countryObj
  }

  // Function to remove tilde and suffix from a string
  function removeSuffix(region) {
    return region.split('~')[0].toUpperCase()
  }

  function parseCountryRegionData() {
    const parsedData = []
    var country, countryCode, regions, countryObject
    CountryRegionData.forEach(countryData => {
      //console.log(countryData);
      country = countryData[0]
      countryCode = countryData[1]
      regions = countryData[2].split('|')

      if (countryCode === 'IN') {
        // defaultCountry = countryData;
        //setSelectedCountry(countryData)
      }
      // Using map to apply the function to each element in the regions array
      const updatedRegions = regions.map(removeSuffix)
      countryObject = { country, countryCode, regions: updatedRegions }
      //const [country, countryCode, regions] = countryData.split(',');
      //const countryObj = { country, countryCode, regions: regions.split('|') };
      parsedData.push(countryObject)
    })
    //console.log("Country data...",parsedData)
    return parsedData
  }

  countriesWithRegions = parseCountryRegionData()
  defaultCountry = countriesWithRegions[102]

  useEffect(() => {
    setSelectedCountryObject(getContryObjectBycountry(selectedCountry))
  }, [selectedCountry])

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue?.country || '')
    setSelectedCountryObject(newValue)
    // Reset selected region when country changes
    setSelectedRegion('')
  }

  // useEffect(() => {
  //   // Fetch data from the API
  //   const fetchData = async () => {
  //     try {
  //       console.log('Setting default country now', countriesWithRegions[102])
  //       setDefaultCountry(countriesWithRegions[102])
  //       setSelectedCountry(countriesWithRegions[102].country)
  //     } catch (error) {
  //       console.error('Error fetching localities:', error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  return (
    <Autocomplete
      autoHighlight
      onChange={handleCountryChange}
      id='autocomplete-country-select'
      options={countriesWithRegions}
      //value={selectedCountry}
      //defaulvatValue={defaultCountry}
      getOptionLabel={option => option.country || ''}
      renderOption={(props, option) => (
        <>
          {/* {console.log(props, option)} */}
          <Box component='li' {...props} key={option.countryCode}>
            <img
              className='mie-4 flex-shrink-0'
              alt=''
              width='20'
              loading='lazy'
              src={`https://flagcdn.com/w20/${option.countryCode.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png 2x`}
            />
            {option.country} ({option.countryCode})
          </Box>
        </>
      )}
      renderInput={params => (
        <TextField
          {...params}
          key={params.key}
          label='Choose a country'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
      value={selectedCountryObject}
    />
  )
}

export default CountryRegionDropdown
