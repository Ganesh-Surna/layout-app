// React Imports
// Component Imports

/********** Standard imports.*********************/
import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Link, Stack, Alert } from '@mui/material'
import CenterBox from '@components/CenterBox'
import Typography from '@mui/material/Typography'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS, API_URLS as ApiUrls } from '@/configs/apiConfig'
import { Box } from '@mui/material'
import { toast } from 'react-toastify'
/********************************************/
import ColumnBox from '@components/ColumnBox'
import DirectionalIcon from '@components/DirectionalIcon'
import Form from '@components/Form'
// MUI Imports
import InputAdornment from '@mui/material/InputAdornment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { usePosition } from '@/utils/usePosition'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import PasswordValidation from './PasswordValidation'
import * as AppCodes from '@/configs/appErrorCodes'
import 'react-toastify/dist/ReactToastify.css'
import * as clientApi from '@/app/api/client/client.api'
import Loading from '@/components/Loading'
import OtpForm from './OTPForm'

const EmailStep = ({
  signUp,
  handleNext,
  email,
  setEmail,
  totalSteps,
  activeStep,
  stepIndex,
  currStatus,
  setCurrStatus,
  gamePin = null
}) => {
  // States

  const router = useRouter()
  const { lang } = useParams()
  const [timer, setTimer] = useState(60) // Timer set to 60 seconds
  const [resendEnabled, setResendEnabled] = useState(false) // State to manage resend button
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [nextPage, setNextPage] = useState('/login')
  const [open, setOpen] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const [otpValue, setOtpValue] = useState('') // State to store the OTP value
  const [isDirty, setIsDirty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isReferralValid, setIsReferralValid] = useState(true) // Default to valid
  const [referrer, setReferrer] = useState(null)
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    console.log('currStatus changed.....', currStatus, 'ref: ', ref)
  }, [currStatus])

  // Function to handle countdown for timer
  useEffect(() => {
    let intervalId

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1)
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [timer, currStatus])

  // Function to handle resend button enable/disable
  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true)
    }
  }, [timer])

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleBlur = () => {
    // Check if the entered email is valid
    const isValid = validateEmail(email)
    setValidEmail(isValid)
  }

  const resendOtp = async () => {
    console.log('resendOtp called.')
    setCurrStatus('UNCONFIRMED')
    setTimer(60)
    const result = await RestApi.post(ApiUrls.v0.USERS_SEND_EMAIL_OTP, { email, action: 'verifyEmail' })
    if (result) {
      console.log('resendOtp called. recieved result', result)
      // toast.success('User Exists: Please verify your email with OTP sent to it.')
      setCurrStatus('CONFIRM_SIGN_UP')
    }
  }

  const handleSignUp = async () => {
    // Add verification logic here
    // alert(`Verifying username: ${email}`);
    if (validEmail) {
      const result = await RestApi.post(ApiUrls.v0.USERS_SIGNUP, {
        email,
        password
      })
      // const result = await clientApi.addOrUpdateUser({
      //   email,
      //   password
      // })
      // ApiResponses.handleServerResponse(result.status, result, router);
      console.log('Signup result', result)
      if (result?.status === 'error') {
        console.log('Error singup..', result.statusCode)
        if (result.statusCode === AppCodes.ERROR_USER_ALREADY_EXISTS_UNVERIFIED) {
          await resendOtp()
        } else {
          setOpen(true)
          setErrorMessage(AppCodes.translateError(result.message, lang))
          setNextPage(result.result['nextPage'])
        }
      } else if (result?.status === 'success') {
        setOpen(false)
        setErrorMessage('')
        setNextPage('')
        setCurrStatus('CONFIRM_SIGN_UP')
      }
    }
  }

  const handleSignIn = () => {
    router.push('/auth/login')
  }

  // Function to handle dialog close and navigation
  const handleClose = confirmed => {
    setOpen(false)
    if (confirmed) {
      // Navigate to the next page if confirmed
      //onConfirm && onConfirm(nextPage,router);
      setOpen(false)
      router.push(nextPage)
    }
  }

  async function handleSignUpConfirmation() {
    var statusOutcome = 'CONFIRM_SIGN_UP'
    try {
      const result = await RestApi.post(ApiUrls.v0.USERS_VERIFY_EMAIL_OTP, {
        email,
        otp: otpValue,
        action: 'verifyEmailOtp'
      })
      console.log('Signup result', result)
      if (result.status === 'success') {
        console.log('Email verified.')
        if (isReferralValid && referrer?.email) {
          // await clientApi.updateReferral(email, { referredBy: referrer.email })
          await RestApi.put(`${ApiUrls.v0.USERS_REFERRER_PROFILE}`, { email, referredBy: referrer.email })
        }
        statusOutcome = 'CONFIRMED'
        setIsDirty(false)
        handleNext()
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.log('error confirming sign up', error.message)
      //CodeMismatchException
      setErrorMessage(error.message)
      return
    } finally {
      console.log('Inside finallay....', statusOutcome)
      setCurrStatus(statusOutcome)
      setIsDirty(false)
    }
  }

  const { latitude, longitude, timestamp, accuracy, speed, heading, error } = usePosition()

  // const loader =
  //   !latitude && !error ? (
  //     <>
  //       <div>Trying to fetch location...</div>
  //       <br />
  //     </>
  //   ) : null

  useEffect(() => {
    const validateReferralToken = async () => {
      if (!ref) {
        setLoading(false)
        return
      }
      try {
        // const result = await clientApi.getUserByReferralToken(ref)
        const result = await RestApi.get(`${API_URLS.v0.USER}?referralToken=${ref}`)
        setIsReferralValid(result?.status === 'success')
        setReferrer(result?.result)
      } catch (error) {
        console.error('Error validating referral token:', error)
        setIsReferralValid(false)
      } finally {
        setLoading(false)
      }
    }

    validateReferralToken()
  }, [ref])

  useEffect(() => {
    setErrorMessage('')
  }, [otpValue])

  if (loading) {
    return <Loading />
  }

  if (!isReferralValid) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' padding={4}>
        <Stack
          spacing={3}
          alignItems='center'
          sx={{
            textAlign: 'center',
            maxWidth: 400,
            padding: 4,
            borderRadius: 2,
            boxShadow: 4,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant='h4' color='error' fontWeight='bold'>
            Invalid Referral Token
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            The referral token you provided is invalid. Please check your link or register without a referral.
          </Typography>
          <Link href='/auth/register' passHref>
            <Button variant='contained' color='primary' component='a' style={{ color: 'white' }} sx={{ mt: 2 }}>
              Back to Register
            </Button>
          </Link>
        </Stack>
      </Box>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {open && (
          <Dialog open={open} onClose={() => handleClose(false)}>
            <DialogTitle>{errorMessage}</DialogTitle>
            <DialogContent>
              <div>Do you want to be redireted to {nextPage} page?.</div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)} color='primary'>
                Cancel
              </Button>
              <Button onClick={() => handleClose(true)} color='primary'>
                Proceed
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Grid item xs={12}>
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <Typography fontSize={30} fontStyle={'italic'} color={'#6066d0'}>
              @email
            </Typography>
            <br />
            {isReferralValid && referrer && (
              <>
                <Typography variant='h6'>
                  Referrer: <span style={{ color: '#6066d0' }}>{referrer.email}</span>
                </Typography>
              </>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
            <p>Create an account to get started !</p>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: 'flex', gap: '4px', margin: 'auto', justifyContent: 'center' }}>
            <TextField
              type='email'
              label='Email'
              fullWidth
              required
              placeholder='knowledge@squizme.com'
              value={email}
              // error={!validEmail}
              // helperText={!validEmail ? 'Invalid email format' : ''}
              InputProps={{
                endAdornment: <InputAdornment position='end'></InputAdornment>
              }}
              onBlur={handleBlur}
              onChange={e => {
                setEmail(e.target.value)
                const isValid = validateEmail(e.target.value)
                setValidEmail(isValid)
                setOtpValue('')
                setCurrStatus('01_SIGNUP_EMAIL_ENTERING')
              }}
            >
              {' '}
            </TextField>
          </div>
        </Grid>
        <Grid item xs={12}>
          <PasswordValidation
            setIsPasswordValid={setIsPasswordValid}
            isPasswordValid={isPasswordValid}
            password={password}
            setPassword={setPassword}
            name={'Password'}
          />
        </Grid>

        <Grid item xs={12}>
          <CenterBox>
            <Button
              variant='contained'
              color={'primary'}
              component='label'
              onClick={handleSignUp}
              disabled={!validEmail || !isPasswordValid}
            >
              <span style={{ color: '#ffff', fontStyle: 'italic', letterSpacing: '1px' }}>
                <b>GO!</b>
              </span>
            </Button>
          </CenterBox>
        </Grid>
        <Grid item xs={12}>
          <CenterBox>
            <ColumnBox hidden={currStatus != 'USER_ALREADY_EXISTS' || isDirty || !isPasswordValid}>
              <Typography color='green' style={{ marginBottom: '10px' }}>
                User Already Registered
              </Typography>
              <Button variant='contained' onClick={handleSignIn} disabled={currStatus != 'USER_ALREADY_EXISTS'}>
                Sign In
              </Button>
            </ColumnBox>
          </CenterBox>
        </Grid>
        {currStatus === 'CONFIRM_SIGN_UP' && (
          <Grid item xs={12}>
            <Box
              sx={{
                width: currStatus === 'CONFIRM_SIGN_UP' || currStatus == 'CODEMISMATCH' ? '100%' : 0,
                height: '100%',
                overflow: 'hidden',
                _backgroundColor: 'lightblue',
                transition: 'width 0.5s ease',
                display: currStatus === 'CONFIRM_SIGN_UP' || currStatus == 'CODEMISMATCH' ? 'block' : 'none'
              }}
            >
              <div style={{ display: 'flex', gap: '4px', margin: 'auto', justifyContent: 'center' }}>
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1'>
                    {/* <Typography variant='h4'>Two Step Verification 💬</Typography> */}
                    <Typography>We have sent a verification code to your email.</Typography>
                  </div>
                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
                    <CenterBox>
                      <Typography>Type in your 6 digit security code </Typography>
                    </CenterBox>
                    <CenterBox>
                      <OtpForm
                        setOtpValue={setOtpValue}
                        otpValue={otpValue}
                        currStatus={currStatus}
                        setIsDirty={setIsDirty}
                      />
                    </CenterBox>
                    {errorMessage && (
                      <Alert
                        sx={{ padding: '0.5rem' }}
                        severity=''
                        icon={<WarningAmberOutlinedIcon fontSize='inherit' />}
                        color='error'
                      >
                        {errorMessage}
                      </Alert>
                    )}
                    <Button
                      disabled={otpValue.length < 6}
                      fullWidth
                      variant='contained'
                      type='button'
                      component='label'
                      style={{ color: 'white' }}
                      onClick={handleSignUpConfirmation}
                    >
                      Verify My Account
                    </Button>
                    <div className='flex justify-center flex-col items-center flex-wrap gap-2'>
                      {/* <Typography hidden={currStatus != 'CODEMISMATCH' || isDirty} color={'red'}>
                      {' '}
                      Invalid Code Entered.
                    </Typography> */}

                      <Typography>
                        Didn&#39;t get the code?{' '}
                        <Button disabled={!resendEnabled}>Resend OTP {timer > 0 && `(${timer}s)`}</Button>{' '}
                      </Typography>
                    </div>
                  </Form>
                </div>
              </div>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}></Grid>

        <Grid item xs={12} className='flex justify-between'>
          <Link href='/'>
            <Button
              // disabled={activeStep === 0}
              color='primary'
              variant='text'
              startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' />}
            >
              Back to Home
            </Button>
          </Link>
          <Link href={gamePin ? `/auth/login?gamePin=${gamePin}` : '/auth/login'}>
            <Button
              // disabled={activeStep === 0}
              color='primary'
              variant='text'
              endIcon={<DirectionalIcon className='ri-arrow-right-line' />}
            >
              Go to Login
            </Button>
          </Link>
          {/* <Button
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Next
          </Button> */}
        </Grid>
      </Grid>
    </>
  )
}

export default EmailStep
