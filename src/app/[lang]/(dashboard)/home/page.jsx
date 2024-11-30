// 'use client'
import React from 'react'
import LandingPage from '@/views/landing-page/LandingPage'
import { Grid, Stack } from '@mui/material'
import CompleteUserProfilePopup from '../dashboards/myprogress/CompleteUserProfilePopup'
import Marquee from '../dashboards/myprogress/Marquee/Marquee'
import { redirect } from 'next/navigation'

async function HomePage({ searchParams }) {
  if (searchParams.gamePin) {
    redirect(`game/join/?gamePin=${searchParams.gamePin}`)
  }
  if (searchParams.redirectTo) {
    redirect(searchParams.redirectTo)
  }
  return (
    <Stack>
      <CompleteUserProfilePopup />
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} className='self-end'>
          <Marquee></Marquee>
        </Grid>
        <Grid item xs={12} mx='auto' mb={8} md={8} className='self-end'>
          <LandingPage />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default HomePage
