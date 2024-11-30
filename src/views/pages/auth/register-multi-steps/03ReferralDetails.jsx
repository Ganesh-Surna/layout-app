// MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import PhoneInput from 'react-phone-input-2'
/********** Standard imports.*********************/
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Link } from '@mui/material'
import CenterBox from '@components/CenterBox'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'
//  const [loading, setLoading] = useState(false)
/********************************************/
// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
// Styled Components
const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content'
})(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center'
}))

const ReferralDetailsStep = ({ handlePrev, handleNext, totalSteps, activeStep, stepIndex, email }) => {
  const [referred, setReferred] = useState('yes') // Initial state for radio button selection
  const [referredUsername, setReferredUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [validEmail, setValidEmail] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [phoneInput, setPhoneInput] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)

  const handleReferredChange = event => {
    setReferred(event.target.value)
  }

  const handleUsernameChange = e => {
    if (e.target.value === email) {
      toast.error("Referrer email should not be same as your's.")
      setReferredUsername('')
      setIsDirty(false)
      setPhoneInput('91')
      setPhoneValid(false)
      setValidEmail(false)
      return
    }
    setReferredUsername(e.target.value)
    const isValid = validateEmail(e.target.value)
    setValidEmail(isValid)
    setIsDirty(true)
    console.log('isDirty', isDirty)
    setPhoneInput('91')
    setPhoneValid(false)
  }

  const handleVerifyClick = async () => {
    setLoading(true)
    setFirstName('')
    setLastName('')
    setIsDirty(false)
    var userId = ''
    var userIdType = ''
    if (phoneValid && !validEmail) {
      userId = phoneInput
      userIdType = 'phone'
    } else {
      userId = referredUsername
      userIdType = 'email'
    }

    try {
      const result = await RestApi.get(
        `${ApiUrls.v0.USERS_PROFILE}/${email}`
      )
      if (result?.status === 'success') {
        console.log(result)
        toast.success('Referrer found. Please Confirm the details.')
        setFirstName(result.result.firstname)
        setLastName(result.result.lastname)
        //setReferredUsername(result.email);
        // setPhoneInput(result.phone);
      } else {
        toast.error('Referrer not found.')
      }
    } catch (error) {
      // toast.error('Error occurred while Fetching name details of referrer, Please retry')
    }
    setLoading(false)
  }

  const handleConfirmClick = async () => {
    setLoading(true)
    if (referredUsername)
      try {
        const result = await RestApi.put(ApiUrls.v0.USERS_REFERRER_PROFILE, {
          email,
          referredBy: referredUsername
        })
        if (result?.status === 'success') {
          // toast.success('Updated Referrer Details Successfully.')
          handleNext()
        } else {
          // toast.error(result?.message || 'Updating referrer details failed, Please retry')
        }
      } catch (error) {
        // toast.error('Error occurred while updating referrer details, Please retry')
      }
    else {
      // toast.error("Referred person's email is not verified.")
    }
    setLoading(false)
  }

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleBlur = () => {
    // Check if the entered email is valid
    const isValid = validateEmail(referredUsername)
    setValidEmail(isValid)
  }

  // Function to handle resend button enable/disable
  useEffect(() => {
    if (isDirty || validEmail) {
      setFirstName('')
      setLastName('')
    }
  }, [validEmail, isDirty])

  const validatePhone = (value, country) => {
    const indianRegex = new RegExp('^[6-9][0-9]{9}$')
    if (country == 91) {
      let contactWithoutCountryCode = value.substring(2, value.length)
      var result = indianRegex.test(contactWithoutCountryCode)
      setPhoneValid(result)
    }
  }

  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Typography fontSize={30} fontStyle={'italic'} color={'#6066d0'}>
              @Referral
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography>Have you been Referred by anyone ?</Typography>
          <FormControl component='fieldset'>
            <RadioGroup name='referred' value={referred} onChange={handleReferredChange}>
              <FormControlLabel value='yes' control={<Radio />} label='Yes (Earn 500 Bonus points)' />
              <FormControlLabel value='no' control={<Radio />} label='No' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={11} md={8}>
          {referred === 'yes' && (
            <>
              {' '}
              <TextField
                label="Referred Person's email"
                variant='outlined'
                value={referredUsername}
                onChange={handleUsernameChange}
                fullWidth
                margin='normal'
                onBlur={handleBlur}
              />
              <CenterBox>
                {' '}
                <Typography fontSize={'0.8rem'} color={'orange'}>
                  {' '}
                  {validEmail ? '(valid)' : '(invalid)'}
                </Typography>
              </CenterBox>
              {/* <div style={{ margin: 'auto', textAlign: 'center' }}>
                <Typography>- OR -</Typography>
              </div> */}
              {/* <Grid item xs={12} sm={12}>
                <PhoneInput
                  countryCodeEditable={false}
                  inputStyle={{ width: '100%', height: '3rem' }}
                  enableSearch={true}
                  country='in'
                  enableTerritories={true}
                  value={phoneInput}
                  //masks={{in: '(....) ...-...', at: '(....) ...-....'}}
                  onChange={(value, country) => {
                    setReferredUsername('')
                    setValidEmail(false)
                    setPhoneInput(value)
                    //setCountryInput(country.dialCode);
                    validatePhone(value, country.dialCode)
                    setIsDirty(true)
                  }}
                ></PhoneInput>
                <CenterBox>
                  {' '}
                  <Typography fontSize={'0.8rem'} color={'orange'}>
                    {' '}
                    {phoneValid ? '(valid)' : '(invalid)'}
                  </Typography>
                </CenterBox>
              </Grid> */}
              <br />
              <Grid item xs={12} sm={12}>
                {loading ? (
                  <CenterBox>
                    <CircularProgress />{' '}
                  </CenterBox>
                ) : (
                  <div style={{ margin: 'auto', textAlign: 'center' }}>
                    <Button
                      variant='contained'
                      component='button'
                      disabled={(!validEmail && !phoneValid) || !isDirty}
                      onClick={handleVerifyClick}
                    >
                      Verify
                    </Button>
                  </div>
                )}
              </Grid>
            </>
          )}
        </Grid>
        {referred === 'yes' && (
          <>
            <Grid item xs={6}>
              <TextField fullWidth label='First Name' placeholder='' disabled value={firstName} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label='Last Name' placeholder='John Doe' disabled value={lastName} />
            </Grid>

            <Grid item xs={12}>
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <Button
                  variant='contained'
                  disabled={isDirty || !referredUsername}
                  component='button'
                  style={{ paddingBottom: '10px' }}
                  onClick={handleConfirmClick}
                >
                  Confirm &
                  <span style={{ color: '#ffff', fontStyle: 'italic', letterSpacing: '1px' }}>
                    <b>&nbsp;GO!</b>
                  </span>
                </Button>
              </div>
            </Grid>
            {/* <Grid item xs={6}>
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <Button variant='contained' component='button' disabled={isDirty} onClick={handleNext}>
                  Skip &{' '}
                  <span style={{ color: '#ffff', fontStyle: 'italic', letterSpacing: '1px' }}>
                    <b>&nbsp; ..GO!</b>
                  </span>
                </Button>
              </div>
            </Grid> */}
          </>
        )}
        {referred === 'no' && (
          <>
            <CenterBox>
              <Grid item xs={12}>
                <div style={{ margin: 'auto', textAlign: 'center' }}>
                  <Button variant='contained' component='button' onClick={handleNext}>
                    <span style={{ color: '#ffff', letterSpacing: '1px' }}>
                      <b>Continue to Next</b>
                    </span>
                  </Button>
                </div>
              </Grid>
            </CenterBox>
          </>
        )}

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
          {referred === 'yes' && (
            <Button
              variant='contained'
              onClick={handleNext}
              endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
            >
              Skip
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ReferralDetailsStep
