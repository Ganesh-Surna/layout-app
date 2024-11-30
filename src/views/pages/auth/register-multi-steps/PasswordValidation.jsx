import { Box, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

export default function PasswordValidation({
  password,
  setPassword,
  isPasswordValid,
  setIsPasswordValid,
  canView = true,
  name,
  size = 'medium',
  shrink = '',
  disabled = false
}) {
  //const [password, setPassword] = useState('')
  const [lengthValid, setLengthValid] = useState(false)
  const [uppercaseValid, setUppercaseValid] = useState(false)
  const [lowercaseValid, setLowercaseValid] = useState(false)
  const [digitValid, setDigitValid] = useState(false)
  const [specialValid, setSpecialValid] = useState(false)

  const [isPasswordShown, setIsPasswordShown] = useState(canView)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handlePasswordChange = event => {
    const value = event.target.value
    setPassword(value)
    const isValid = validatePassword(value)
    setIsPasswordValid(isValid)
  }

  useEffect(() => {
    // if (password) {
    var validity = validatePassword(password)
    setIsPasswordValid(validity)
    // }
  }, [password])

  const validatePassword = value => {
    if (value === '') {
      setLengthValid(false)
      setUppercaseValid(false)
      setLowercaseValid(false)
      setDigitValid(false)
      setSpecialValid(false)
      return false
    }

    // Check if password length is at least 8 characters
    setLengthValid(value.length >= 8)

    // Check if there is at least one uppercase letter
    setUppercaseValid(/[A-Z]/.test(value))

    // Check if there is at least one lowercase letter
    setLowercaseValid(/[a-z]/.test(value))

    // Check if there is at least one digit
    setDigitValid(/\d/.test(value))

    // Check if there is at least one special character

    setSpecialValid(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))

    if (lengthValid && uppercaseValid && lowercaseValid && digitValid && specialValid) {
      return true
    }
  }

  return (
    <>
      <TextField
        fullWidth
        label={name}
        name={name}
        disabled={disabled}
        autoComplete='off'
        onChange={handlePasswordChange}
        type={isPasswordShown ? 'text' : 'password'}
        id='name'
        value={password}
        placeholder='Enter password'
        InputProps={{
          autoComplete: 'off',
          // readOnly: isPasswordShown ? true : false,
          endAdornment: canView ? (
            <InputAdornment position='end'>
              <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
              </IconButton>
            </InputAdornment>
          ) : (
            ''
          )
        }}
        // InputLabelProps={{ shrink: shrink }}
        required
      />
      <Box hidden={isPasswordValid} className='flex flex-col gap-0'>
        <FormControlLabel
          style={{ cursor: 'default' }}
          disabled={!lengthValid}
          control={<Checkbox size={size} checked={lengthValid} style={{ cursor: 'default' }} disableRipple />}
          label='8 characters minimum'
        />
        <FormControlLabel
          style={{ cursor: 'default' }}
          disabled={!uppercaseValid}
          control={<Checkbox size={size} checked={uppercaseValid} style={{ cursor: 'default' }} disableRipple />}
          label='At least one uppercase letter'
        />
        <FormControlLabel
          style={{ cursor: 'default' }}
          disabled={!lowercaseValid}
          control={<Checkbox size={size} checked={lowercaseValid} style={{ cursor: 'default' }} disableRipple />}
          label='At least one lowercase letter'
        />
        <FormControlLabel
          style={{ cursor: 'default' }}
          disabled={!digitValid}
          control={<Checkbox size={size} checked={digitValid} style={{ cursor: 'default' }} disableRipple />}
          label='At least one digit'
        />
        <FormControlLabel
          style={{ cursor: 'default' }}
          disabled={!specialValid}
          control={<Checkbox size={size} checked={specialValid} style={{ cursor: 'default' }} disableRipple />}
          label='At least one special character'
        />
      </Box>
    </>
  )
}
