'use client'
// Component Imports
import AdvList from '@views/apps/advertisements/list'
/********** Standard imports.*********************/
import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Link } from '@mui/material'
import CenterBox from '@components/CenterBox'
import Typography from '@mui/material/Typography'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import { toast } from 'react-toastify'
/********************************************/

const AdvtListApp = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  // Vars
  useEffect(() => {
    async function getData() {
      // toast.success('Fetching the Advertisements now...')
      setLoading(true)
      const result = await RestApi.get(ApiUrls.v0.ADMIN_GET_ADVERTISEMENT)

      if (result?.status === 'success') {
        console.log('Advts Fetched result', result)
        // toast.success('Advts Fetched Successfully .')
        setLoading(false)
        setData(result.result)
        // handleClose();
      } else {
        // toast.error('Error:' + result.message)
        setLoading(false)
        setData(result.result)
      }
    }
    getData()
    console.log('THE ADVT RESULT ')
  }, [])

  if (loading) return <>Fetching Advertisements Please Wait...</>
  return <AdvList tableData={data} />
}

export default AdvtListApp
