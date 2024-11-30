'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

// Component Imports
import Logo from '@core/svg/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Alert } from '@mui/material'
import * as RestApi from '@/utils/restApiUtil'

const ForgotPasswordV2 = ({ mode }) => {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(null)
  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-forgot-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-forgot-password-light-border.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  async function handleSendResetLink() {
    if (!email) {
      setErr('Please enter your email.')
      return
    }

    setErr(null)

    const result = await RestApi.post(`/api/forgot-password`, { email: email })
    if (result.status === 'success') {
      toast.success(result.message || 'Reset link has been sent to your email.')
    } else {
      toast.error(result.message || 'Failed to send reset link. Please try again.')
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'>
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <div className='flex justify-center items-center gap-3 mbe-6'>
            <Logo className='text-primary' height={28} width={35} />
            <Typography variant='h4' className='font-semibold tracking-[0.15px]'>
              {themeConfig.templateName}
            </Typography>
          </div>
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography className='mbs-1'>
              Enter your email and we&#39;ll send you instructions to reset your password
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-5'>
            <TextField value={email} name='email' onChange={handleEmailChange} autoFocus fullWidth label='Email' />
            <Button
              onClick={handleSendResetLink}
              // disabled={err && (!email || !email.includes('@'))}
              fullWidth
              variant='contained'
              // style={{color: 'white'}}
              type='submit'
            >
              Send reset link
            </Button>
            {err && (
              <Alert
                sx={{ padding: '0.5rem' }}
                severity=''
                icon={<WarningAmberOutlinedIcon fontSize='inherit' />}
                color='error'
              >
                {err}
              </Alert>
            )}
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href='/login' className='flex items-center'>
                <i className='ri-arrow-left-s-line' />
                <span>Back to Login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordV2
