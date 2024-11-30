'use client'

import countryList from 'react-select-country-list'
import ReactCropperComponet, { ReactCropperComponent } from './ReactCropperComponent'

import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

// Components Imports
import SearchableSelect from './SearchableSelect'
import EducationModal from './EducationModal'
import NewAssociatedOrganization from './NewAssociatedOrganization'
import NewLanguageModal from './NewLanguageModal'
import CurrentWorkingPositionModal from './CurrentWorkingPositionModal'
import CircularProgressWithValueLabel from './CircularProgressWithValueLabel'

// Mui-file-input Imports
import { MuiFileInput } from 'mui-file-input'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// react-icons Imports
import { RiAddFill, RiCloseFill } from 'react-icons/ri'
import { IoMdAttach } from 'react-icons/io'

// MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import CropIcon from '@mui/icons-material/Crop'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Tooltip
} from '@mui/material'
import { getRandomValues } from 'crypto'
import CountryRegionDropdown from '../../auth/register-multi-steps/CountryRegionDropdown'
import AutocompletePostOffice from '../../auth/register-multi-steps/AutocompletePostOffice'
import CenterBox from '@/components/CenterBox'
import AutocompletePincode from '../../auth/register-multi-steps/AutocompletePincode'
import {
  getFileFromS3,
  convertFileToBufferFile,
  deleteFileFromS3,
  uploadFileToS3,
  deleteFileWithUnknownExtension,
  userProfileBucketName,
  getFileFromS3WithUnknownExtension,
  getFileExtension,
  getFileUrlFromS3WithUnknownExtension
} from '@/utils/awsS3Utils'
import * as clientApi from '@/app/api/client/client.api'

const casteOptions = [
  'Brahmin',
  'Kshatriya',
  'Vaishya',
  'Shudra',
  'Dalit',
  'Adivasi',
  'OBC',
  'SC',
  'ST',
  'General',
  'Other'
]

const categoryOptions = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']

const motherTongueLanguagesData = [
  'Arabic',
  'Assamese',
  'Awadhi',
  'Bengali',
  'Bhojpuri',
  'Chinese',
  'English',
  'French',
  'German',
  'Gujarati',
  'Hindi',
  'Haryanvi',
  'Kannada',
  'Konkani',
  'Magahi',
  'Malayalam',
  'Marathi',
  'Nepali',
  'Odia',
  'Portuguese',
  'Punjabi',
  'Sanskrit',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu'
]

const timezoneOptions = [
  { value: 'gmt-12', label: '(GMT-12:00) International Date Line West' },
  { value: 'gmt-11', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'gmt-10', label: '(GMT-10:00) Hawaii' },
  { value: 'gmt-09', label: '(GMT-09:00) Alaska' },
  { value: 'gmt-08', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'gmt-08-baja', label: '(GMT-08:00) Tijuana, Baja California' },
  { value: 'gmt-07', label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan' },
  { value: 'gmt-07-mt', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'gmt-06', label: '(GMT-06:00) Central America' },
  { value: 'gmt-06-ct', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'gmt-06-mc', label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey' },
  { value: 'gmt-06-sk', label: '(GMT-06:00) Saskatchewan' },
  { value: 'gmt-05', label: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco' },
  { value: 'gmt-05-et', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'gmt-05-ind', label: '(GMT-05:00) Indiana (East)' },
  { value: 'gmt-04', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'gmt-04-clp', label: '(GMT-04:00) Caracas, La Paz' }
]

const religionOptions = [
  { value: 'hindu', label: 'Hindu' },
  { value: 'christian', label: 'Christian' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'jain', label: 'Jain' },
  { value: 'zoroastrian', label: 'Zoroastrian' },
  { value: 'pagan', label: 'Pagan' },
  { value: 'islam', label: 'Islam' },
  { value: 'other', label: 'Other' }
]

const profilePoints = {
  firstname: 5,
  lastname: 5,
  age: 5,
  gender: 5,
  motherTongue: 5,
  religion: 5,
  caste: 5,
  category: 5,
  knownLanguageIds: 5,
  profilePhoto: 5,
  address: 5,

  accountType: 10,
  zipcode: 10,
  phone: 10,
  voterId: 10
}

const initialProfilePercentage = 5

// Vars
const initialData = {
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  gender: '',
  age: '',
  accountType: '',
  phone: '',
  address: '',
  country: '',
  region: '',
  zipcode: '',
  locality: '',
  timezone: '',
  religion: '',
  caste: '',
  category: '',
  knownLanguageIds: [],
  motherTongue: '',
  voterId: '',
  currentSchoolId: '',
  currentWorkingPositionId: '',
  linkedInUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  openToWork: false,
  hiring: false,
  organization: '',
  websiteUrl: '',
  activeAssociatedOrganizationIds: [],

  nickname: '',
  organizationRegistrationNumber: '',
  organizationGSTNumber: '',
  organizationPANNumber: ''
}

const AccountDetails = () => {
  // Country options
  // const options = useMemo(() => countryList().getData(), [])

  const { data: session } = useSession()

  // States
  const [formData, setFormData] = useState(initialData)
  const [fileInput, setFileInput] = useState(null)
  const [resumeFileInput, setResumeFileInput] = useState(null)

  const [organizationRegistrationDocument, setOrganizationRegistrationDocument] = useState(null)
  const [organizationGSTDocument, setOrganizationGSTDocument] = useState(null)
  const [organizationPANDocument, setOrganizationPANDocument] = useState(null)

  const [imgSrc, setImgSrc] = useState(null)

  const [isEpicValid, setIsEpicValid] = useState(true) // State to manage EPIC validity
  const [isUrlsValid, setIsUrlsValid] = useState({ instagramUrl: true, linkedInUrl: true, facebookUrl: true }) // State to
  const [isEpicVerified, setIsEpicVerified] = useState(false)
  const [isEpicVerifyClicked, setIsEpicVerifyClicked] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isPhoneVerifyClicked, setIsPhoneVerifyClicked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({
    language: false,
    education: false,
    workingPosition: false,
    associatedOrganization: false
  })
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [getLoading, setGetLoading] = useState(false)
  const [languageOptions, setLanguageOptions] = useState([])
  const [associatedOrganizationOptions, setAssociatedOrganizationOptions] = useState([])
  const [schoolOptions, setSchoolOptions] = useState([])
  const [workingPositionOptions, setWorkingPositionOptions] = useState([])
  const [shouldRefetchData, setShouldRefetchData] = useState(false)
  const [profilePercentage, setProfilePercentage] = useState(initialProfilePercentage)
  const [voterIdPhotos, setVoterIdPhotos] = useState({ front: '', back: '' })
  const [voterIdPhotoFiles, setVoterIdPhotoFiles] = useState({ front: '', back: '' })
  const [isCropMode, setIsCropMode] = useState({ front: true, back: true })
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountryObject, setSelectedCountryObject] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [zipcodeFromDb, setZipcodeFromDb] = useState('')
  const [localityFromDb, setLocalityFromDb] = useState('')
  const [selectedZipcode, setSelectedZipcode] = useState('')
  const [selectedLocality, setSelectedLocality] = useState('')
  const [postOffices, setPostOffices] = useState([])
  const [loadingPincodesOrPostOffices, setLoadingPincodesOrPostOffices] = useState(false)
  const [pinCodes, setPinCodes] = useState([])

  useEffect(() => {
    if (session && session.user) {
      if (session.user.email) {
        setFormData({ ...formData, email: session.user.email })
      }
      if (session.user.image) {
        setImgSrc(session.user.image)
      }
    }
  }, [session])

  useEffect(() => {
    setFormData(prev => ({ ...prev, country: selectedCountry }))
  }, [selectedCountry])
  useEffect(() => {
    setFormData(prev => ({ ...prev, region: selectedRegion }))
  }, [selectedRegion])
  useEffect(() => {
    setFormData(prev => ({ ...prev, zipcode: selectedZipcode }))
  }, [selectedZipcode])
  useEffect(() => {
    setFormData(prev => ({ ...prev, locality: selectedLocality }))
  }, [selectedLocality])

  async function getProfilePhoto() {
    // image url
    try {
      const fileUrl = await getFileUrlFromS3WithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: `${session?.user?.email}/profile_photo`
      })
      if (fileUrl) {
        setImgSrc(fileUrl)
      }
    } catch (error) {
      console.log('Error getting profile photo url: ', error)
    }

    // actual file
    try {
      const file = await getFileFromS3WithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: `${session?.user?.email}/profile_photo`
      })
      console.log('Profile photo file: ', file)
      if (file) {
        setFileInput(file)
      } else {
        console.log('No profile photo file found')
        setFileInput(null)
      }
    } catch (err) {
      console.log('Error getting profile photo file: ', err)
    }
  }
  async function getOrganizationRegistrationDoc() {
    try {
      const file = await getFileFromS3WithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: `${session?.user?.email}/organization_registration`
      })
      console.log('Reg file: ', file)
      if (file) {
        setOrganizationRegistrationDocument(file)
      } else {
        console.log('No reg file found')
        setOrganizationRegistrationDocument(null)
      }
    } catch (err) {
      console.log('Error getting reg file: ', err)
    }
  }
  async function getOrganizationGSTDoc() {
    try {
      const file = await getFileFromS3WithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: `${session?.user?.email}/organization_gst`
      })
      console.log('GST file: ', file)
      if (file) {
        setOrganizationGSTDocument(file)
      } else {
        console.log('No GST file found')
        setOrganizationGSTDocument(null)
      }
    } catch (error) {
      console.log('Error getting GST file: ', error)
    }
  }
  async function getOrganizationPANDoc() {
    try {
      const file = await getFileFromS3WithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: `${session?.user?.email}/organization_pan`
      })
      console.log('PAN file: ', file)
      if (file) {
        setOrganizationPANDocument(file)
      } else {
        console.log('No PAN file found')
        setOrganizationPANDocument(null)
      }
    } catch (error) {
      console.log('Error getting PAN file: ', error)
    }
  }

  async function getUploadedFilesFromS3() {
    await getProfilePhoto()
    await getOrganizationRegistrationDoc()
    await getOrganizationGSTDoc()
    await getOrganizationPANDoc()
  }

  useEffect(() => {
    setProfilePercentage(initialProfilePercentage)

    async function getData() {
      // toast.success('Fetching user profile now...')
      setGetLoading(true)
      const result = await RestApi.get(`${ApiUrls.v0.USERS_PROFILE}/${session.user.email}`)
      // const result = await clientApi.getUserProfileByEmail(session.user.email)

      console.log('RESULT: ', result)
      if (result?.status === 'success') {
        console.log('User profile Fetched result', result)
        // toast.success('User profile Fetched Successfully .')
        setGetLoading(false)
        setFormData({ ...formData, ...result.result })

        for (let key in profilePoints) {
          if (result.result[key]) {
            if (!(Array.isArray(result.result[key]) && result.result[key].length === 0)) {
              setProfilePercentage(prev => prev + profilePoints[key])
            }
          }
        }

        if (result.result?.image) {
          setImgSrc(result.result.image)
        }
        if (result.result?.schools?.length > 0) {
          setSchoolOptions(result.result.schools.map(item => ({ value: item._id, label: item.school })))
        }
        if (result.result?.workingPositions?.length > 0) {
          setWorkingPositionOptions(
            result.result.workingPositions.map(item => ({ value: item._id, label: item.title }))
          )
        }
        if (result.result?.languages?.length > 0) {
          setLanguageOptions(result.result.languages.map(item => ({ value: item._id, label: item.language })))
        }
        if (result.result?.associatedOrganizations?.length > 0) {
          setAssociatedOrganizationOptions(
            result.result.associatedOrganizations.map(item => ({ value: item._id, label: item.organization }))
          )
        }
        if (result.result?.country) {
          setSelectedCountry(result.result.country)
        }
        if (result.result?.region) {
          setSelectedRegion(result.result.region)
        }
        if (result.result?.zipcode) {
          setZipcodeFromDb(result.result.zipcode)
          setSelectedZipcode(result.result.zipcode)
        }
        if (result.result?.locality) {
          setLocalityFromDb(result.result.locality)
          setSelectedLocality(result.result.locality)
        }
        // handleClose();
      } else {
        // toast.error('Error:' + result.message)
        setGetLoading(false)
        // setFormData({ ...formData, ...result.result })
      }
    }

    if (session && session.user && session.user.email) {
      getData()
      getUploadedFilesFromS3()
    }
    console.log('THE USER PROFILE RESULT ')
  }, [session, shouldRefetchData])

  useEffect(() => {
    if (selectedRegion) {
      setSelectedLocality('')
      setSelectedZipcode('')
      setPinCodes([])
      fetchPinCodesForState(selectedRegion)
    }
  }, [selectedRegion])

  const fetchPinCodesForState = async selectedStateName => {
    console.log('Selected selectedStateName:', selectedStateName)
    setLoadingPincodesOrPostOffices(true)
    try {
      const response = await fetch(`http://localhost:3000/api/pincodes/${selectedStateName}`)

      const data = await response.json()
      console.log('pinCode data...', data)
      setPinCodes(data?.pinCodes[0].PinCodes)
    } catch (e) {
      setLoadingPincodesOrPostOffices(false)
    } finally {
      setLoadingPincodesOrPostOffices(false)
    }
  }

  const fetchPostOffices = async selectedZipcode => {
    console.log('Selected zipcode Object:', selectedZipcode)
    setLoadingPincodesOrPostOffices(true)
    try {
      const response = await fetch(`http://localhost:3000/api/localities/${selectedZipcode}`)

      const data = await response.json()
      console.log('pincode data...', data)

      setPostOffices(data.localities) // Assuming data is an array of post office objects
    } catch (error) {
      console.error('Error fetching post offices:', error)
    } finally {
      setLoadingPincodesOrPostOffices(false)
    }
  }

  useEffect(() => {
    if (zipcodeFromDb) {
      setSelectedZipcode(zipcodeFromDb)
    }
  }, [pinCodes])
  useEffect(() => {
    if (localityFromDb) {
      setSelectedLocality(localityFromDb)
    }
  }, [postOffices])

  useEffect(() => {
    if (selectedZipcode) {
      fetchPostOffices(selectedZipcode)
    }
  }, [selectedZipcode])

  function handleCloseModal(identifier) {
    setIsModalOpen(prev => ({ ...prev, [identifier]: false }))
  }
  function handleOpenModal(identifier) {
    setIsModalOpen(prev => ({ ...prev, [identifier]: true }))
  }

  const handleDeleteChipFromMultiSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field]].filter(each => each !== value) }))
  }

  function validateUrl(field, value) {
    if (field === 'linkedInUrl') {
      const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/
      return linkedinRegex.test(value)
    } else if (field === 'facebookUrl') {
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/
      return facebookRegex.test(value)
    } else if (field === 'instagramUrl') {
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/
      return instagramRegex.test(value)
    }
  }

  const handleFormChange = (field, value) => {
    if (field === 'voterId') {
      setIsEpicValid(validateEpic(value)) // Validate EPIC
      setIsEpicVerifyClicked(false)
      // setIsEpicVerified(false)
    }
    if (field === 'linkedInUrl') {
      setIsUrlsValid(prev => ({ ...prev, [field]: validateUrl(field, value) }))
    }
    if (field === 'facebookUrl') {
      setIsUrlsValid(prev => ({ ...prev, [field]: validateUrl(field, value) }))
    }
    if (field === 'instagramUrl') {
      setIsUrlsValid(prev => ({ ...prev, [field]: validateUrl(field, value) }))
    }
    if (field === 'phone') {
      // setIsPhoneValid(validatePhone(value)) // Validate phone
      setIsPhoneVerifyClicked(false)
      // setIsPhoneVerified(false)
    }
    setFormData(prev => ({ ...prev, [field]: value }))
    console.log('Value: ', value, typeof value)
  }

  const handleFileInputChange = event => {
    console.log('photo file', event)
    const { files } = event.target

    if (files && files.length > 0) {
      const file = files[0] // Get the first file object

      // Use FileReader to preview the image
      const reader = new FileReader()
      reader.onload = () => {
        setImgSrc(reader.result) // Set image preview
      }
      reader.readAsDataURL(file) // Read file for preview

      // Set the actual file object as fileInput
      setFileInput(file)
    }
  }

  const handleResumeFileInputChange = file => {
    console.log('resume file', file)
    setResumeFileInput(file)
  }

  const handleFileInputChangeByFieldName = (fieldName, file) => {
    console.log('resume file', file)
    if (fieldName === 'organizationRegistrationDocument') {
      setOrganizationRegistrationDocument(file)
    } else if (fieldName === 'organizationGSTDocument') {
      setOrganizationGSTDocument(file)
    } else if (fieldName === 'organizationPANDocument') {
      setOrganizationPANDocument(file)
    }
  }

  const validateEpic = epic => {
    // Step 1: Check length
    if (epic.length !== 10) {
      return false
    }

    // Step 2: Split into alphabetic and numeric parts
    const alphaPart = epic.slice(0, 3)
    const numericPart = epic.slice(3)

    // Step 3: Check alphabetic part
    if (!/^[A-Z]+$/.test(alphaPart)) {
      return false
    }

    // Step 4: Check numeric part
    if (!/^\d+$/.test(numericPart)) {
      return false
    }

    return true
  }

  function handleVerifyEpic() {
    setIsEpicVerifyClicked(true)
    setIsEpicVerified(prev => !prev)
  }
  function handleVerifyPhone() {
    setIsPhoneVerifyClicked(true)
    setIsPhoneVerified(prev => !prev)
  }

  function getLanguageLabel(value) {
    return languageOptions.find(option => option.value === value)?.label || 'Unknown'
  }

  function getAssocaiatedOrganizationLabel(value) {
    return associatedOrganizationOptions.find(option => option.value === value)?.label || 'Unknown'
  }

  function handleResetFiles() {
    setFileInput(null)
    setImgSrc('/images/avatars/1.png')
    setOrganizationRegistrationDocument(null)
    setOrganizationGSTDocument(null)
    setOrganizationPANDocument(null)
  }

  function handleResetForm() {
    setFormData(initialData)
    handleResetFiles()
    setShouldRefetchData(prev => !prev)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(formData)
    console.log('photo file: ', fileInput)
    console.log('resume file: ', resumeFileInput)
    console.log('reg file: ', organizationRegistrationDocument)
    console.log('GST file: ', organizationGSTDocument)
    console.log('PAN file: ', organizationPANDocument)

    // return
    setIsFormSubmitting(true)
    // toast.success('Updating user profile...')

    if (
      (formData.age && (+formData.age > 120 || +formData.age < 6)) ||
      (formData.linkedInUrl && !isUrlsValid.linkedInUrl) ||
      (formData.facebookUrl && !isUrlsValid.facebookUrl) ||
      (formData.instagramUrl && !isUrlsValid.instagramUrl)
    ) {
      setIsFormValid(false)
      setIsFormSubmitting(false)
      // toast.error('Invalid form data. Recheck and submit valid data.')
      return
    }

    setIsFormValid(true)

    let allFormData = {}

    for (let key in formData) {
      if (typeof formData[key] === 'string') {
        if (formData[key].trim() !== '') {
          allFormData[key] = formData[key]
        }
      } else if (Array.isArray(formData[key])) {
        if (formData[key].length > 0) {
          allFormData[key] = formData[key]
        }
      } else if (typeof formData[key] !== 'NaN') {
        allFormData[key] = formData[key]
      }
    }

    let data = { ...allFormData, age: +allFormData.age }

    if (data.accountType === 'BUSINESS' || data.accountType === 'NGO') {
      data = { ...data, school: '', openToWork: false, nickname: '' }
    } else if (data.accountType === 'INDIVIDUAL') {
      data = {
        ...data,
        organization: '',
        organizationRegistrationNumber: '',
        organizationGSTNumber: '',
        organizationPANNumber: '',
        websiteUrl: '',
        hiring: false,
        associatedOrganization: '',
        associatedOrganizationType: '',
        associatedOrganizationWebsiteUrl: ''
      }
    }

    console.log('User profile data sending to POST:', data)

    const result = await RestApi.put(`${ApiUrls.v0.USERS_PROFILE}/${session?.user?.email}`, data)
    // const result = await clientApi.updateUserProfile(session.user.email, data)
    if (result.status === 'success') {
      console.log('Updated  result', result.result)
      // toast.success('User profile Updated .')
      console.log('user profile updating result', result.result)
      if (fileInput) {
        await handleUploadFilesToS3() // uploading files to S3
      }
      setFormData(initialData)
      setIsFormSubmitting(false)
      handleResetForm()
    } else {
      console.error('Error in handleSubmit:', result, result?.message)
      // toast.error('Error:' + result.message)
      // toast.error('Error:', result)
      setIsFormSubmitting(false)
    }
  }

  async function handleUploadProfilePhotoToS3() {
    const fileNameWithoutExtension = `${session?.user?.email}/profile_photo`

    try {
      await deleteFileWithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: fileNameWithoutExtension
      })
    } catch (error) {
      console.error('Error in handleDeleteProfilePhotoToS3:', error)
    }

    if (fileInput) {
      const bufferFile = await convertFileToBufferFile(fileInput)
      const fileType = getFileExtension(fileInput.name)
      const fileName = `${session?.user?.email}/profile_photo.${fileType}`

      try {
        await uploadFileToS3({
          bucketName: userProfileBucketName,
          fileBuffer: bufferFile,
          fileName,
          fileType
        })
        console.log('Profile photo uploaded to S3 successfully.')
      } catch (error) {
        console.error('Error in handleUploadProfilePhotoToS3:', error)
        // toast.error('Error uploading profile photo to S3:', error.message)
      }
    }
  }

  async function handleUploadOrganizationRegistrationDocToS3() {
    const fileNameWithoutExtension = `${session?.user?.email}/organization_registration`

    try {
      await deleteFileWithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: fileNameWithoutExtension
      })
    } catch (error) {
      console.error('Error in handleDeleteOrganizationRegistrationDocToS3:', error)
    }

    if (organizationRegistrationDocument) {
      const bufferFile = await convertFileToBufferFile(organizationRegistrationDocument)
      const fileType = getFileExtension(organizationRegistrationDocument.name) // organizationRegistrationDocument.type.split('/')[1]
      const fileName = `${session?.user?.email}/organization_registration.${fileType}`

      try {
        await uploadFileToS3({
          bucketName: userProfileBucketName,
          fileBuffer: bufferFile,
          fileName,
          fileType
        })
        console.log('Organization Registartion Doc uploaded to S3 successfully.')
      } catch (error) {
        console.error('Error in handleUploadOrganizationRegistrationDocToS3:', error)
        // toast.error('Error uploading profile photo to S3:', error.message)
      }
    }
  }

  async function handleUploadOrganizationGSTDocToS3() {
    const fileNameWithoutExtension = `${session?.user?.email}/organization_gst`

    try {
      await deleteFileWithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: fileNameWithoutExtension
      })
    } catch (error) {
      console.error('Error in handleDeleteOrganizationGSTDocToS3:', error)
    }

    if (organizationGSTDocument) {
      const bufferFile = await convertFileToBufferFile(organizationGSTDocument)
      const fileType = getFileExtension(organizationGSTDocument.name) // organizationGSTDocument.type.split('/')[1]
      const fileName = `${session?.user?.email}/organization_gst.${fileType}`

      try {
        await uploadFileToS3({
          bucketName: userProfileBucketName,
          fileBuffer: bufferFile,
          fileName,
          fileType
        })
        console.log('Organization GST Doc uploaded to S3 successfully.')
      } catch (error) {
        console.error('Error in handleUploadOrganizationGSTDocToS3:', error)
        // toast.error('Error uploading profile photo to S3:', error.message)
      }
    }
  }

  async function handleUploadOrganizationPANDocToS3() {
    const fileNameWithoutExtension = `${session?.user?.email}/organization_pan`

    try {
      await deleteFileWithUnknownExtension({
        bucketName: userProfileBucketName,
        fileNamePrefix: fileNameWithoutExtension
      })
    } catch (error) {
      console.error('Error in handleDeleteOrganizationPANDocToS3:', error)
    }

    if (organizationPANDocument) {
      const bufferFile = await convertFileToBufferFile(organizationPANDocument)
      const fileType = getFileExtension(organizationPANDocument.name) // organizationPANDocument.type.split('/')[1]
      const fileName = `${session?.user?.email}/organization_pan.${fileType}`

      try {
        await uploadFileToS3({
          bucketName: userProfileBucketName,
          fileBuffer: bufferFile,
          fileName,
          fileType
        })
        console.log('Organization PAN Doc uploaded to S3 successfully.')
      } catch (error) {
        console.error('Error in handleUploadOrganizationPANDocToS3:', error)
        // toast.error('Error uploading profile photo to S3:', error.message)
      }
    }
  }

  async function handleUploadFilesToS3() {
    await handleUploadProfilePhotoToS3()
    await handleUploadOrganizationRegistrationDocToS3()
    await handleUploadOrganizationGSTDocToS3()
    await handleUploadOrganizationPANDocToS3()
  }

  const handleVoterIdPhotosInputChange = (file, side) => {
    const reader = new FileReader()
    const { files } = file.target

    if (files && files.length !== 0) {
      reader.onload = () => setVoterIdPhotos(prev => ({ ...prev, [side]: reader.result }))
      reader.readAsDataURL(files[0])
    }
  }

  const handleVoterIdPhotoDelete = side => {
    setVoterIdPhotos(prev => ({ ...prev, [side]: '' }))
    setIsCropMode(prev => ({ ...prev, [side]: true }))
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  return (
    <Card>
      <CardContent className='mbe-1'>
        <div className='flex items-start sm:items-center justify-between gap-6'>
          <div className='relative group'>
            <img
              height={100}
              width={100}
              className='rounded'
              src={imgSrc || session?.user?.image || '/images/avatars/1.png'}
              alt='Profile'
            />
            <Tooltip title='Upload New Photo' arrow>
              <IconButton
                component='label'
                size='large'
                color='primary'
                className='absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[100px] p-0 flex items-center justify-center bg-white bg-opacity-75 rounded-none opacity-0 group-hover:opacity-100 transition-opacity'
                htmlFor='account-settings-upload-image'
              >
                <CloudUploadIcon />
                <input
                  hidden
                  type='file'
                  // value={fileInput}
                  accept='.jpg, .png, .jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </IconButton>
            </Tooltip>
          </div>

          {/* Your Profile ( Percentage ) */}
          <Stack direction='column' gap={'5px'} sx={{ alignSelf: 'flex-start', alignItems: 'center' }}>
            <Typography sx={{ textAlign: 'center' }} variant='h6' color={'primary'}>
              Your Profile
            </Typography>
            <Box>
              <CircularProgressWithValueLabel
                value={profilePercentage}
                size={50}
                thickness={5}
                fontSize={14}
                textcolor='text.secondary'
              />
            </Box>
          </Stack>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            {/* ----Personal Information---- */}
            <Grid item xs={12} marginLeft={'0.25rem'}>
              <Divider> Personal Information </Divider>
            </Grid>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='firstname'
                label='First Name'
                value={formData.firstname}
                placeholder='John'
                onChange={e => handleFormChange('firstname', e.target.value)}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='lastname'
                label='Last Name'
                value={formData.lastname}
                placeholder='Doe'
                onChange={e => handleFormChange('lastname', e.target.value)}
              />
            </Grid>

            {/* Nick Name */}
            {formData.accountType === 'INDIVIDUAL' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='nickname'
                  label='Nick Name'
                  value={formData.nickname}
                  placeholder='Doe'
                  onChange={e => handleFormChange('nickname', e.target.value)}
                />
              </Grid>
            )}

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name='gender'
                  label='Gender'
                  value={formData.gender}
                  onChange={e => handleFormChange('gender', e.target.value)}
                >
                  <MenuItem value='male'>Male</MenuItem>
                  <MenuItem value='female'>Female</MenuItem>
                  <MenuItem value='transgender'>Transgender</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Age */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Age'
                name='age'
                type='number'
                value={formData.age}
                InputProps={{
                  inputProps: {
                    min: 6,
                    max: 120,
                    step: 1
                  }
                }}
                error={!isFormValid && (formData.age < 6 || formData.age > 120)}
                helperText={
                  !isFormValid && (formData.age < 6 || formData.age > 120) ? 'Age must be between 6 and 120' : ''
                }
                placeholder='21'
                onChange={e => handleFormChange('age', e.target.value)}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                disabled
                label='Email'
                name='email'
                value={formData.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>

            {/* Account Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  label='Account Type'
                  name='accountType'
                  value={formData.accountType}
                  onChange={e => handleFormChange('accountType', e.target.value)}
                >
                  <MenuItem value='INDIVIDUAL'>Individual</MenuItem>
                  <MenuItem value='BUSINESS'>Business</MenuItem>
                  <MenuItem value='NGO'>NGO</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <Grid container alignItems={'center'} justifyContent='center' spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    name='phone'
                    label='Phone Number'
                    value={formData.phone}
                    placeholder='+1 (234) 567-8901'
                    onChange={e => handleFormChange('phone', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant='contained'
                    color={
                      isPhoneVerifyClicked && isPhoneVerified
                        ? 'success'
                        : isPhoneVerifyClicked && !isPhoneVerified
                          ? 'error'
                          : 'primary'
                    }
                    onClick={handleVerifyPhone}
                    disabled={!formData.phone || isPhoneVerifyClicked} // Disable button if no voter ID or invalid format
                  >
                    {isEpicVerifyClicked && isEpicVerified
                      ? 'Verified'
                      : isEpicVerifyClicked && !isEpicVerified
                        ? 'Invalid'
                        : 'Verify'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Languages */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Languages</InputLabel>
                <Select
                  multiple
                  name='knownLanguageIds'
                  label='Languages'
                  value={formData.knownLanguageIds}
                  onChange={e => handleFormChange('knownLanguageIds', e.target.value)}
                  renderValue={selected => (
                    <div className='flex flex-wrap gap-2'>
                      {selected &&
                        selected.length > 0 &&
                        selected.map(value => (
                          <Chip
                            key={value}
                            clickable
                            deleteIcon={
                              <i className='ri-close-circle-fill' onMouseDown={event => event.stopPropagation()}></i>
                            }
                            size='small'
                            label={getLanguageLabel(value)}
                            onDelete={() => handleDeleteChipFromMultiSelect('knownLanguageIds', value)}
                          />
                        ))}
                    </div>
                  )}
                >
                  {languageOptions.map(each => (
                    <MenuItem key={each.value} value={each.value}>
                      {each.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                startIcon={<RiAddFill />}
                sx={{ alignSelf: 'flex-start' }}
                variant='text'
                color='primary'
                onClick={() => handleOpenModal('language')}
              >
                Add New Language
              </Button>
            </Grid>

            {/* Mother Tongue */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mother Tongue</InputLabel>
                <Select
                  name='motherTongue'
                  label='Mother Tongue'
                  value={formData.motherTongue}
                  onChange={e => handleFormChange('motherTongue', e.target.value)}
                >
                  {motherTongueLanguagesData.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Religion */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Religion</InputLabel>
                <Select
                  label='Religion'
                  name='religion'
                  value={formData.religion}
                  onChange={e => handleFormChange('religion', e.target.value)}
                >
                  {religionOptions.map(religion => (
                    <MenuItem key={religion.value} value={religion.value}>
                      {religion.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Caste */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Caste</InputLabel>
                <Select
                  name='caste'
                  label='Caste'
                  value={formData.caste}
                  onChange={e => handleFormChange('caste', e.target.value)}
                >
                  {casteOptions.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name='category'
                  label='Category'
                  value={formData.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                >
                  {categoryOptions.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ----Voter Id---- */}
            <Grid item xs={12} marginLeft={'0.25rem'}>
              <Divider> Voter Id </Divider>
            </Grid>

            {/* Voter Id Front-Side */}
            <Grid item xs={12} sm={6} display='flex' flexDirection='column' justifyContent='center' alignItems='strech'>
              {voterIdPhotos.front ? (
                !isCropMode.front ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '250px',
                      height: '250px',
                      background: 'rgba(201,186,228,0.25)',
                      padding: '5px',
                      borderRadius: '10px'
                    }}
                  >
                    <img
                      src={voterIdPhotos.front}
                      alt='Voter ID Front'
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '5px' }}
                    />
                    <Stack
                      flexDirection='row'
                      gap='0.5rem'
                      alignItems='center'
                      sx={{ position: 'absolute', bottom: 0, right: 5 }}
                    >
                      <Button
                        variant='text'
                        color='error'
                        size='small'
                        onClick={() => handleVoterIdPhotoDelete('front')}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        component='label'
                        variant='contained'
                        sx={{
                          color: 'white'
                        }}
                        size='small'
                        onClick={() => setIsCropMode(prev => ({ ...prev, front: true }))}
                        startIcon={<CropIcon />}
                      >
                        Crop
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <ReactCropperComponent
                    image={voterIdPhotos.front}
                    onImageChange={handleVoterIdPhotosInputChange}
                    side={'front'}
                    setImageFile={setVoterIdPhotoFiles}
                    setImage={setVoterIdPhotos}
                    setIsCropMode={setIsCropMode}
                    onDelete={handleVoterIdPhotoDelete}
                  />
                )
              ) : (
                <Button
                  component='label'
                  variant='outlined'
                  sx={
                    {
                      // width: '150px',
                      // height: '90px',
                      // color: 'white'
                    }
                  }
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Voter Id Front-Side
                  <VisuallyHiddenInput
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={e => handleVoterIdPhotosInputChange(e, 'front')}
                  />
                </Button>
              )}
            </Grid>

            {/* Voter Id Back-Side */}
            <Grid item xs={12} sm={6} display='flex' flexDirection='column' justifyContent='center' alignItems='strech'>
              {voterIdPhotos.back ? (
                !isCropMode.back ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '250px',
                      height: '250px',
                      // border: '1px solid #cacaca',
                      background: 'rgba(201,186,228,0.25)',
                      padding: '5px',
                      borderRadius: '10px'
                    }}
                  >
                    <img
                      src={voterIdPhotos.back}
                      alt='Voter ID Back'
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '5px' }}
                    />
                    <Stack
                      flexDirection='row'
                      gap='0.5rem'
                      alignItems='center'
                      sx={{ position: 'absolute', bottom: 0, right: 5 }}
                    >
                      <Button
                        variant='text'
                        color='error'
                        size='small'
                        onClick={() => handleVoterIdPhotoDelete('back')}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        component='label'
                        variant='contained'
                        sx={{
                          color: 'white'
                        }}
                        size='small'
                        startIcon={<CropIcon />}
                        onClick={() => setIsCropMode(prev => ({ ...prev, back: true }))}
                      >
                        Crop
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <ReactCropperComponet
                    image={voterIdPhotos.back}
                    onImageChange={handleVoterIdPhotosInputChange}
                    side={'back'}
                    setImageFile={setVoterIdPhotoFiles}
                    setImage={setVoterIdPhotos}
                    setIsCropMode={setIsCropMode}
                    onDelete={handleVoterIdPhotoDelete}
                  />
                )
              ) : (
                <Button
                  component='label'
                  variant='outlined'
                  sx={
                    {
                      // width: '150px',
                      // height: '90px',
                      // color: 'white'
                    }
                  }
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Voter Id Back-Side
                  <VisuallyHiddenInput
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={e => handleVoterIdPhotosInputChange(e, 'back')}
                  />
                </Button>
              )}
            </Grid>
            {/* Voter Id EPIC Input */}
            <Grid item xs={12} sm={6}>
              <Grid container alignItems={'center'} justifyContent='center' spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    name='voterId'
                    fullWidth
                    label='Voter Id (EPIC)'
                    value={formData.voterId}
                    placeholder='XXXXXXXXXX'
                    onChange={e => handleFormChange('voterId', e.target.value)}
                    error={!isEpicValid} // Set error state based on EPIC validation
                    helperText={!isEpicValid ? 'Invalid EPIC format' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant='contained'
                    color={
                      isEpicVerifyClicked && isEpicVerified
                        ? 'success'
                        : isEpicVerifyClicked && !isEpicVerified
                          ? 'error'
                          : 'primary'
                    }
                    onClick={handleVerifyEpic}
                    disabled={!formData.voterId || !isEpicValid || isEpicVerifyClicked} // Disable button if no voter ID or invalid format
                  >
                    {isEpicVerifyClicked && isEpicVerified
                      ? 'Verified'
                      : isEpicVerifyClicked && !isEpicVerified
                        ? 'Invalid'
                        : 'Verify'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* ----Address---- */}
            <Grid item xs={12} marginLeft={'0.25rem'}>
              <Divider> Address </Divider>
            </Grid>
            {/* Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                name='address'
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6}>
              {/* <FormControl fullWidth> */}
              <CountryRegionDropdown
                selectedCountryObject={selectedCountryObject}
                setSelectedCountryObject={setSelectedCountryObject}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
              ></CountryRegionDropdown>
              {/* </FormControl> */}
            </Grid>

            {/* Region */}
            {selectedCountryObject?.country && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    onChange={(e, newValue) => setSelectedRegion(newValue)}
                    id='autocomplete-region-select'
                    options={selectedCountryObject?.regions || []}
                    getOptionLabel={option => option || ''}
                    renderInput={params => (
                      <TextField
                        {...params}
                        key={params.id}
                        label='Choose a region'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password'
                        }}
                      />
                    )}
                    value={selectedRegion}
                  />
                </FormControl>
              </Grid>
            )}

            {selectedCountryObject?.country === 'India' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <AutocompletePincode
                    fetchPostOffices={fetchPostOffices}
                    loading={loadingPincodesOrPostOffices}
                    pinCodes={pinCodes}
                    selectedZipcode={selectedZipcode}
                    setSelectedZipcode={setSelectedZipcode}
                  ></AutocompletePincode>
                </FormControl>
              </Grid>
            )}
            {selectedCountryObject?.country === 'India' && selectedZipcode && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <AutocompletePostOffice
                    postOffices={postOffices}
                    loading={loadingPincodesOrPostOffices}
                    selectedLocality={selectedLocality}
                    setSelectedLocality={setSelectedLocality}
                  ></AutocompletePostOffice>
                </FormControl>
              </Grid>
            )}

            {selectedCountryObject?.country !== 'India' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    value={selectedZipcode}
                    fullWidth
                    label='Enter Your Zip Code'
                    onChange={e => {
                      setSelectedZipcode(e.target.value)
                    }}
                  ></TextField>
                </FormControl>
              </Grid>
            )}

            {selectedCountryObject?.country !== 'India' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    value={selectedLocality}
                    onChange={e => {
                      setSelectedLocality(e.target.value)
                    }}
                    fullWidth
                    label='Enter Your Locality/City/Village'
                  ></TextField>
                </FormControl>
              </Grid>
            )}

            {/* TimeZone */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>TimeZone</InputLabel>
                <Select
                  name='timezone'
                  label='TimeZone'
                  value={formData.timezone}
                  onChange={e => handleFormChange('timezone', e.target.value)}
                  MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                >
                  {timezoneOptions.map(each => (
                    <MenuItem key={each.value} value={each.value}>
                      {each.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ----Education---- */}
            {formData.accountType === 'INDIVIDUAL' && (
              <>
                <Grid item xs={12} marginLeft={'0.25rem'}>
                  <Divider> Education </Divider>
                </Grid>
                {/* School */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>School</InputLabel>
                    <Select
                      label='School'
                      name='currentSchoolId'
                      value={formData.currentSchoolId}
                      onChange={e => handleFormChange('currentSchoolId', e.target.value)}
                    >
                      {schoolOptions.map(each => (
                        <MenuItem key={each.value} value={each.value}>
                          {each.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <Button
                      startIcon={<RiAddFill />}
                      sx={{ alignSelf: 'flex-start' }}
                      variant='text'
                      color='primary'
                      onClick={() => handleOpenModal('education')}
                    >
                      Add Education
                    </Button>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* ----Work History---- */}
            <Grid item xs={12} marginLeft={'0.25rem'}>
              <Divider> Work History </Divider>
            </Grid>
            {/* Current Working Position */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Current Position</InputLabel>
                <Select
                  label='Current Position'
                  name='currentWorkingPositionId'
                  value={formData.currentWorkingPositionId}
                  onChange={e => handleFormChange('currentWorkingPositionId', e.target.value)}
                >
                  {workingPositionOptions.map(each => (
                    <MenuItem key={each.value} value={each.value}>
                      {each.label}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  startIcon={<RiAddFill />}
                  sx={{ alignSelf: 'flex-start' }}
                  variant='text'
                  color='primary'
                  onClick={() => handleOpenModal('workingPosition')}
                >
                  Add New Position
                </Button>
              </FormControl>
            </Grid>

            {/* Open To Work */}
            {formData.accountType === 'INDIVIDUAL' && (
              <Grid item xs={12} sm={6}>
                <FormGroup sx={{ width: '100%' }}>
                  <Stack sx={{ width: '100%' }} flexDirection='row' justifyContent={'center'}>
                    {
                      <FormControlLabel
                        checked={formData.openToWork}
                        control={<Checkbox />}
                        label='Open to work'
                        name='openToWork'
                        onChange={(e, checked) => handleFormChange('openToWork', checked)}
                      />
                    }
                  </Stack>
                </FormGroup>
              </Grid>
            )}

            {/* Hiring */}
            {(formData.accountType === 'BUSINESS' || formData.accountType === 'NGO') && (
              <Grid item xs={12} sm={6}>
                <FormGroup sx={{ width: '100%' }}>
                  <Stack sx={{ width: '100%' }} flexDirection='row' justifyContent={'center'}>
                    {
                      <FormControlLabel
                        name='hiring'
                        checked={formData.hiring}
                        control={<Checkbox />}
                        label='Hiring'
                        onChange={(e, checked) => handleFormChange('hiring', checked)}
                      />
                    }
                  </Stack>
                </FormGroup>
              </Grid>
            )}

            {/* ----Business Details---- */}
            {(formData.accountType === 'BUSINESS' || formData.accountType === 'NGO') && (
              <>
                <Grid item xs={12} marginLeft={'0.25rem'}>
                  <Divider>{formData.accountType === 'NGO' ? 'Organization Details' : 'Business Details'}</Divider>
                </Grid>

                {/* Organization */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name='organization'
                    label='Your Organization'
                    value={formData.organization}
                    placeholder='ThemeSelection'
                    onChange={e => handleFormChange('organization', e.target.value)}
                  />
                </Grid>

                {/* Website Url */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={formData.accountType === 'NGO' ? 'Organization Website Url' : 'Business Website Url'}
                    name='websiteUrl'
                    value={formData.websiteUrl}
                    placeholder='Ex: https://www.triesoltech.com'
                    onChange={e => handleFormChange('websiteUrl', e.target.value)}
                  />
                </Grid>

                {/* Registration No. */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={
                      formData.accountType === 'NGO' ? 'Organization Registration No.' : 'Business Registration No.'
                    }
                    name='organizationRegistrationNumber'
                    value={formData.organizationRegistrationNumber}
                    // placeholder='Ex: https://www.triesoltech.com'
                    onChange={e => handleFormChange('organizationRegistrationNumber', e.target.value)}
                  />
                </Grid>

                {/* Registration Document */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <MuiFileInput
                      label={
                        formData.accountType === 'NGO' ? 'Organization Registration Doc.' : 'Business Registration Doc.'
                      }
                      name='organizationRegistrationDocument'
                      value={organizationRegistrationDocument}
                      onChange={e => handleFileInputChangeByFieldName('organizationRegistrationDocument', e)}
                      fullWidth
                      clearIconButtonProps={{
                        title: 'Remove',
                        children: <RiCloseFill />
                      }}
                      placeholder='upload registration document (pdf/doc/image)'
                      InputProps={{
                        inputProps: {
                          accept: '.pdf,.doc,.docx,.jpeg,.png,.jpg'
                        },
                        startAdornment: <IoMdAttach />
                      }}
                    />
                  </FormControl>
                </Grid>

                {/* GST No. */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={formData.accountType === 'NGO' ? 'Organization GST No.' : 'Business GST No.'}
                    name='organizationGSTNumber'
                    value={formData.organizationGSTNumber}
                    // placeholder='Ex: https://www.triesoltech.com'
                    onChange={e => handleFormChange('organizationGSTNumber', e.target.value)}
                  />
                </Grid>

                {/* GST Document */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <MuiFileInput
                      label={formData.accountType === 'NGO' ? 'GST Doc.' : 'Business GST Doc.'}
                      name='organizationGSTDocument'
                      value={organizationGSTDocument}
                      onChange={e => handleFileInputChangeByFieldName('organizationGSTDocument', e)}
                      fullWidth
                      clearIconButtonProps={{
                        title: 'Remove',
                        children: <RiCloseFill />
                      }}
                      placeholder='upload GST document (pdf/doc/image)'
                      InputProps={{
                        inputProps: {
                          accept: '.pdf,.doc,.docx,.jpeg,.png,.jpg'
                        },
                        startAdornment: <IoMdAttach />
                      }}
                    />
                  </FormControl>
                </Grid>

                {/* PAN No. */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={formData.accountType === 'NGO' ? 'Organization PAN No.' : 'Business PAN No.'}
                    name='organizationPANNumber'
                    value={formData.organizationPANNumber}
                    // placeholder='Ex: https://www.triesoltech.com'
                    onChange={e => handleFormChange('organizationPANNumber', e.target.value)}
                  />
                </Grid>

                {/* PAN Document */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <MuiFileInput
                      label={formData.accountType === 'NGO' ? 'GST Doc.' : 'Business GST Doc.'}
                      name='organizationPANDocument'
                      value={organizationPANDocument}
                      onChange={e => handleFileInputChangeByFieldName('organizationPANDocument', e)}
                      fullWidth
                      clearIconButtonProps={{
                        title: 'Remove',
                        children: <RiCloseFill />
                      }}
                      placeholder='upload PAN document (pdf/doc/image)'
                      InputProps={{
                        inputProps: {
                          accept: '.pdf,.doc,.docx,.jpeg,.png,.jpg'
                        },
                        startAdornment: <IoMdAttach />
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Associated Organizations */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Associated Organizations</InputLabel>
                <Select
                  multiple
                  name='activeAssociatedOrganizationIds'
                  label=' Associated Organizations'
                  value={formData.activeAssociatedOrganizationIds}
                  onChange={e => handleFormChange('activeAssociatedOrganizationIds', e.target.value)}
                  renderValue={selected => (
                    <div className='flex flex-wrap gap-2'>
                      {selected &&
                        selected.length > 0 &&
                        selected.map(value => (
                          <Chip
                            key={value}
                            clickable
                            deleteIcon={
                              <i className='ri-close-circle-fill' onMouseDown={event => event.stopPropagation()}></i>
                            }
                            size='small'
                            label={getAssocaiatedOrganizationLabel(value)}
                            onDelete={() => handleDeleteChipFromMultiSelect('activeAssociatedOrganizationIds', value)}
                          />
                        ))}
                    </div>
                  )}
                >
                  {associatedOrganizationOptions.map(each => (
                    <MenuItem key={each.value} value={each.value}>
                      {each.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                startIcon={<RiAddFill />}
                sx={{ alignSelf: 'flex-start' }}
                variant='text'
                color='primary'
                onClick={() => handleOpenModal('associatedOrganization')}
              >
                Add New Associated Organization
              </Button>
            </Grid>

            {/* ----Upload Resume---- */}
            {formData.accountType === 'INDIVIDUAL' && (
              <>
                <Grid item xs={12} marginLeft={'0.25rem'}>
                  <Divider> Upload Resume </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    {/* <InputLabel>Resume</InputLabel> */}
                    <MuiFileInput
                      label='Resume'
                      name='resumeFileInput'
                      value={resumeFileInput}
                      onChange={handleResumeFileInputChange}
                      fullWidth
                      clearIconButtonProps={{
                        title: 'Remove',
                        children: <RiCloseFill />
                      }}
                      placeholder='upload your resume (.pdf/.doc/.docx)'
                      InputProps={{
                        inputProps: {
                          accept: '.pdf,.doc,.docx'
                        },
                        startAdornment: <IoMdAttach />
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            {/* ----Socaial Media Profiles---- */}
            <Grid item xs={12} marginLeft={'0.25rem'}>
              <Divider> Social Media Profiles </Divider>
            </Grid>
            {/* Linkedin */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='linkedInUrl'
                label='Linkedin'
                value={formData.linkedInUrl}
                // error={!isFormValid && formData.linkedInUrl && !isUrlsValid.linkedInUrl}
                error={formData.linkedInUrl && !isUrlsValid.linkedInUrl}
                helperText={formData.linkedInUrl && !isUrlsValid.linkedInUrl ? 'Invalid Url' : ''}
                placeholder='Ex: https://www.linkedin.com/in/your-profile'
                onChange={e => handleFormChange('linkedInUrl', e.target.value)}
              />
            </Grid>

            {/* Facebook */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='facebookUrl'
                label='Facebook'
                value={formData.facebookUrl}
                placeholder='Ex: https://www.facebook.com/your-profile'
                // error={!isFormValid && formData.facebookUrl && !isUrlsValid.facebookUrl}
                error={formData.facebookUrl && !isUrlsValid.facebookUrl}
                helperText={formData.facebookUrl && !isUrlsValid.facebookUrl ? 'Invalid Url' : ''}
                onChange={e => handleFormChange('facebookUrl', e.target.value)}
              />
            </Grid>

            {/* Instagram */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='instagramUrl'
                label='Instagram'
                value={formData.instagramUrl}
                placeholder='Ex: https://www.instagram.com/your-profile'
                // error={!isFormValid && formData.instagramUrl && !isUrlsValid.instagramUrl}
                error={formData.instagramUrl && !isUrlsValid.instagramUrl}
                helperText={formData.instagramUrl && !isUrlsValid.instagramUrl ? 'Invalid Url' : ''}
                onChange={e => handleFormChange('instagramUrl', e.target.value)}
              />
            </Grid>

            {isModalOpen.language && (
              <NewLanguageModal
                email={session?.user?.email}
                open={isModalOpen.language}
                onClose={() => handleCloseModal('language')}
                onRefetchUserProfileData={handleRefetchUserProfileData}
              />
            )}
            {isModalOpen.associatedOrganization && (
              <NewAssociatedOrganization
                email={session?.user?.email}
                open={isModalOpen.associatedOrganization}
                onClose={() => handleCloseModal('associatedOrganization')}
                onRefetchUserProfileData={handleRefetchUserProfileData}
              />
            )}
            {isModalOpen.education && (
              <EducationModal
                email={session?.user?.email}
                open={isModalOpen.education}
                onClose={() => handleCloseModal('education')}
                onRefetchUserProfileData={handleRefetchUserProfileData}
              />
            )}
            {isModalOpen.workingPosition && (
              <CurrentWorkingPositionModal
                email={session?.user?.email}
                open={isModalOpen.workingPosition}
                onClose={() => handleCloseModal('workingPosition')}
                onRefetchUserProfileData={handleRefetchUserProfileData}
              />
            )}

            {/* Actions */}
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button
                disabled={
                  isFormSubmitting ||
                  getLoading ||
                  !isEpicValid ||
                  (formData.facebookUrl && !isUrlsValid.facebookUrl) ||
                  (formData.instagramUrl && !isUrlsValid.instagramUrl) ||
                  (formData.linkedInUrl && !isUrlsValid.linkedInUrl)
                }
                variant='contained'
                type='submit'
              >
                Save Changes
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={handleResetForm}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
