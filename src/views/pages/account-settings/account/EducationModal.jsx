import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import React, { useState } from 'react'

import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import * as clientApi from '@/app/api/client/client.api'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const initialFormData = {
  school: '',
  degree: '',
  highestQualification: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  description: ''
}

const highestQualificationOptions = [
  '7th Grade',
  '10th Grade',
  '12th Grade',
  'Diploma / Vocational Training',
  'Associate Degree',
  "Bachelor's Degree / Graduation",
  "Master's Degree / Post Graduation",
  'Doctorate (Ph.D.)',
  'Professional Degree (MD, JD, etc.)',
  'Certificate Course',
  'Postdoctoral Fellowship',
  'Other'
]

function EducationModal({ open, onClose, email, onRefetchUserProfileData }) {
  const [formData, setFormData] = useState(initialFormData)
  const [isFormValid, setIsFormValid] = useState(true)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  function handleClose() {
    setFormData(initialFormData)
    setIsFormValid(true)
    onClose()
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }
  async function handleSubmit() {
    // Validate form
    setIsFormSubmitting(true)

    if (!formData.school.trim()) {
      setIsFormValid(false)
      setIsFormSubmitting(false)
      return
    }

    setIsFormValid(true)

    try {
      // Make API request to add new education details
      // const response = await RestApi.post(`${ApiUrls.v0.USERS_PROFILE}/schools`, { email, school: formData })
      const response = await clientApi.addSchool(email, formData)

      if (response.status === 'success') {
        // Optionally update local state or refetch data
        console.log('Education details added successfully:', response.result)
        // toast.success('Education details added successfully.')
        onClose()
        onRefetchUserProfileData()
      } else {
        // toast.error('Error: ' + response.message)
        console.error('Error adding education details:', response.message)
      }
    } catch (error) {
      // toast.error('An unexpected error occurred.')
      console.error('Unexpected error:', error)
    } finally {
      setIsFormSubmitting(false)
    }
  }

  return (
    <Grid xs={12} sm={8} md={6}>
      <Dialog sx={{ width: '100%', margin: 'auto' }} open={open} onClose={handleClose}>
        <DialogTitle>Add Your Education</DialogTitle>

        <DialogContent>
          <form>
            <Grid container spacing={5}>
              {/* School */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='School'
                  value={formData.school}
                  placeholder='Ex: ZPHS Veerannapet'
                  onChange={e => handleFormChange('school', e.target.value)}
                  error={!isFormValid && formData.school.trim().length === 0}
                  helperText={!isFormValid && formData.school.trim().length === 0 ? 'School is a required field!' : ''}
                />
              </Grid>

              {/* Highest Qualification */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Highest Qualification</InputLabel>
                  <Select
                    value={formData.highestQualification}
                    onChange={e => handleFormChange('highestQualification', e.target.value)}
                    label='Highest Qualification'
                  >
                    {highestQualificationOptions.map((qualification, index) => (
                      <MenuItem key={index} value={qualification}>
                        {qualification}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Degree */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Degree'
                  value={formData.degree}
                  placeholder="Ex: Bachelor's"
                  onChange={e => handleFormChange('degree', e.target.value)}
                />
              </Grid>

              {/* Field of study */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Field of study'
                  value={formData.fieldOfStudy}
                  placeholder='Ex: Business'
                  onChange={e => handleFormChange('fieldOfStudy', e.target.value)}
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label='Start date'
                      format='DD-MM-YYYY'
                      value={dayjs(formData.startDate)}
                      onChange={value => handleFormChange('startDate', value)}
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: false
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              {/* End Date */}
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label='End date'
                      format='DD-MM-YYYY'
                      value={dayjs(formData.endDate)}
                      onChange={value => handleFormChange('endDate', value)}
                      minDate={dayjs(formData.startDate).add(1, 'days')}
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: false
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Description'
                  multiline
                  rows={4}
                  value={formData.description}
                  placeholder='Write a brief description of your education experience.'
                  onChange={e => handleFormChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Grid container xs={12}>
            {/* Actions */}
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button disabled={isFormSubmitting} variant='contained' type='submit' onClick={handleSubmit}>
                Save
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default EducationModal
