// MUI Imports
// Component Imports
/********** Standard imports.*********************/
import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Link } from '@mui/material'
import CenterBox from '@components/CenterBox'
import Typography from '@mui/material/Typography'
import * as RestApi from '@/utils/restApiUtil'
import * as clientApi from '@/app/api/client/client.api'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'
/********************************************/
import DirectionalIcon from '@components/DirectionalIcon'

const AddressInfoStep = ({
  handleNext,
  handlePrev,
  stepIndex,
  totalSteps,
  activeStep,
  firstName,
  setFirstName,
  email
}) => {
  const [street, setStreet] = useState()
  const [colony, setColony] = useState('')
  const [village, setVillage] = useState('')

  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateName = name => {
    return /^[A-Za-z]+$/.test(name) && name.length >= 3
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        console.log(result)
      })
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }, [])

  const handleStreetNameChange = e => {
    const value = e.target.value
    setStreet(value)
    if (!validateName(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        firstName: 'Minimum 3 alphabetic characters are required'
      }))
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        firstName: ''
      }))
    }
    setIsButtonEnabled(validateName(colony) && validateName(street))
  }

  const handleColonyNameChange = e => {
    const value = e.target.value
    setColony(value)
    if (!validateName(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        lastName: 'Minimum 3 alphabetic characters are required'
      }))
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        lastName: ''
      }))
    }
    setIsButtonEnabled(validateName(colony) && validateName(street))
  }

  const handleVillageNameChange = e => {
    const value = e.target.value
    setVillage(value)
    if (!validateName(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        lastName: 'Minimum 3 alphabetic characters are required'
      }))
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        lastName: ''
      }))
    }
    setIsButtonEnabled(validateName(colony) && validateName(village) && validateName(colony))
  }

  const handleSaveName = () => {
    // Add verification logic here
    updateAddressDetails()
  }

  const updateAddressDetails = async () => {
    setLoading(true)
    try {
      const result = await RestApi.put(ApiUrls.v0.USERS_PROFILE, {
        email,
        street: street,
        colony: colony,
        village: village
      })
      // const result = await clientApi.updateUserProfile(email, {
      //   street,
      //   colony,
      //   village
      // })
      if (result?.status === 'success') {
        // toast.success('Updated Address Details Successfully.')
        handleNext()
      } else {
        // toast.error(result?.message || 'Updating address details failed, Please retry')
      }
    } catch (error) {
      // toast.error('Error occurred while updating address details, Please retry')
    }
    setLoading(false)
  }

  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Typography fontSize={30} fontStyle={'italic'} color={'#6066d0'}>
              @Address
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Typography fontSize={16} color={'blueviolet'}>
              {`"To get specific Quizzes, Events & News in your area."`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Street Name'
            fullWidth
            variant='outlined'
            value={street}
            onChange={handleStreetNameChange}
            error={errors.street ? true : false}
            helperText={errors.street}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Colony Name'
            fullWidth
            variant='outlined'
            value={colony}
            onChange={handleColonyNameChange}
            error={errors.colony ? true : false}
            helperText={errors.colony}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Village/City Name'
            fullWidth
            maxLength={30}
            maxWidth={30}
            variant='outlined'
            value={village}
            onChange={handleVillageNameChange}
            error={errors.village ? true : false}
            helperText={errors.village}
          />
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <CenterBox>
              <CircularProgress />{' '}
            </CenterBox>
          ) : (
            <CenterBox>
              <Button
                variant='contained'
                color={'primary'}
                component='button'
                onClick={handleSaveName}
                disabled={
                  errors.street ||
                  errors.village ||
                  errors.colony ||
                  street.length < 3 ||
                  colony.length < 3 ||
                  village.length < 3
                }
              >
                <span style={{ color: '#ffff', fontStyle: 'italic', letterSpacing: '1px' }}>
                  <b>GO!</b>
                </span>
              </Button>
            </CenterBox>
          )}
        </Grid>

        <Grid item xs={12} className='flex justify-end'>
          {/* <Button
            disabled={activeStep === 0}
            variant='outlined'
            color='secondary'
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Previous
          </Button> */}
          <Button
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Skip
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default AddressInfoStep
