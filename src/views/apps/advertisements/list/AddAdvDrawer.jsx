
/********** Standard imports.*********************/
import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import { TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, Link } from '@mui/material'
import CenterBox from '@components/CenterBox'
import Typography from '@mui/material/Typography'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig';
//import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'
/********************************************/

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import StartAndEndDatePicker from './StartAndEndDatePicker'

// Vars
const initialData = {
  userName: '',
  email: '',
  contact: '',
  company: '',
  description: "",
  imageUrl: "",
  actionUrl: "",
  runType: '',
  mediaType:'',
  status: '',
  startDate: new Date(),
  endDate: new Date(),
  advtCategory: ""
}

const AddAdvDrawer = ({ open, handleClose, mode = 'add', setData, pInitialData, getCurrentData }) => {
  // States
  const [formData, setFormData] = useState(pInitialData)
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    // if (mode == 'edit')
    //   // toast.success("Updating the Advertisement now...");
    // else
    //   // toast.success("Adding new Advt");


    if (mode == 'add') {
      const result = await RestApi.post(ApiUrls.v0.ADMIN_ADD_ADVERTISEMENT,
        formData);
      setLoading(true);
      if (result.status === 'success') {
        console.log("Advt added result", result.result.result)
        // toast.success('Advt added .')
        setData(result.result.result);
        setLoading(false);
        handleClose();
      } else {
        // toast.error("Error:" + result.message);
        setLoading(false);
      }
    }
    else {
      console.log("Updating the advt.")
      const result = await RestApi.put(ApiUrls.v0.ADMIN_ADD_ADVERTISEMENT,
        formData);
      setLoading(true);
      if (result.status === 'success') {
        console.log("Updated  result", result.result.result)
        // toast.success('Advt Updated .')
        setData(result.result.result);
        setLoading(false);
        handleClose();
      } else {
        // toast.error("Error:" + result.message);
        setLoading(false);
      }
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData({
      userName: '',
      email: '',
      contact: '',
      company: '',
      description: "",
      imageUrl: "",
      actionUrl: "",
      runType: '',
      mediaType:'',
      status: '',
      startDate: new Date(),
      endDate: new Date()
    })
  }

  useEffect(() => {
    setFormData(getCurrentData());
    console.log("getting latest editable data");
  }, [open])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-[15px]'>
        <Typography variant='h5'>Add New Advt</Typography>
        <IconButton onClick={handleReset}>
          <i className='ri-close-line' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            label='User name'
            fullWidth
            required
            placeholder='pvr'
            value={formData.userName}
            onChange={e => setFormData({ ...formData, userName: e.target.value })}
          />
          <TextField
            label='Email'
            fullWidth
            placeholder='pvr@gmail.com'
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label='Company'
            required
            fullWidth
            placeholder='Company PVT LTD'
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
          />

          <TextField
            label='Contact'
            type='number'
            required
            minLength={10}
            fullWidth
            placeholder='(397) 294-5153'
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          />

          <TextField
            label='Description'
            type='text'
            required
            fullWidth
            placeholder='About Add'
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            label='Image Url'
            required
            type='text'
            fullWidth
            placeholder='http://example.com/image.png'
            value={formData.imageUrl}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
          />

          <TextField
            label='Action Url'
            type='text'
            fullWidth
            placeholder='http://'
            value={formData.actionUrl}
            onChange={e => setFormData({ ...formData, actionUrl: e.target.value })}
          />

          <StartAndEndDatePicker formData={formData} setFormData={setFormData} startDate={formData.startDate} endDate={formData.endDate}></StartAndEndDatePicker>

          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              required
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              label='Select Status'
              labelId='status-select'
              inputProps={{ placeholder: 'Select Status' }}
            >
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>In Active</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Media Type</InputLabel>
            <Select
              fullWidth
              id='select-mediaType'
              required
              value={formData.mediaType}
              onChange={e => setFormData({ ...formData, mediaType: e.target.value })}
              label='Select Media Type'
              labelId='status-mediaType'
              inputProps={{ placeholder: 'Select Media Type' }}
            >
              <MenuItem value='video'>Video</MenuItem>
              <MenuItem value='image'>Image</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Run Type</InputLabel>
            <Select
              required
              fullWidth
              id='select-runtype'
              value={formData.runType}
              onChange={e => setFormData({ ...formData, runType: e.target.value })}
              label='Select Run Type'
              labelId='status-runtype'
              inputProps={{ placeholder: 'Select Run Type' }}
            >
              <MenuItem value='animate__shakeX'>Shake X</MenuItem>
              <MenuItem value='flashing-ad'>Flashing</MenuItem>
              <MenuItem value='animate__animated animate__bounce'>Bounce</MenuItem>
              <MenuItem value='animate__animated animate__rubberBand'>Rubber Band</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Advt Category</InputLabel>
            <Select
              fullWidth
              required
              id='select-advtCategory'
              value={formData.advtCategory}
              onChange={e => setFormData({ ...formData, advtCategory: e.target.value })}
              label='Select Advt Category'

              labelId='status-category'
              inputProps={{ placeholder: 'Select Advt Category' }}
            >
              <MenuItem value='top'>Top Rolling Banner</MenuItem>
              <MenuItem value='bottom'>Bottom Banner</MenuItem>
              <MenuItem value='login'>Login Screen</MenuItem>
              <MenuItem value='landing'>Landing Page (My Progress)</MenuItem>
            </Select>
          </FormControl>

          {/* <TextField
            label='Start Date'
            type='text'
            fullWidth
            placeholder='YYYY-MM-DD'
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
          />
          <TextField
            label='End Date'
            type='text'
            fullWidth
            placeholder='YYYY-MM-DD'
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
          /> */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button disabled={loading} variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddAdvDrawer
