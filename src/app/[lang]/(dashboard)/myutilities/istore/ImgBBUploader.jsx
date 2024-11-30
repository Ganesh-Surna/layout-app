import React, { useState, useRef } from 'react'
import { Button, InputLabel } from '@mui/material'

const ImgBBUploader = ({ notifyImageUrl }) => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [albumId, setAlbumId] = useState('triesoltech') // Set your album ID here
  const [isLoading, setIsLoading] = useState(false)

  const handleButtonClick = async () => {
    readBlobFromClipboard().then(blob => {
      if (blob) {
        console.log('Blob read from clipboard:', blob)
        // Upload the Blob to ImgBB API
        uploadBlobToImgBB(blob).then(imageUrl => {
          if (imageUrl) {
            console.log('Image uploaded successfully:', imageUrl)
            // Do something with the uploaded image URL
            notifyImageUrl(imageUrl)
            setImageUrl(imageUrl)
          } else {
            console.log('Image upload failed')
          }
        })
      } else {
        console.log('No Blob found in clipboard')
      }
    })
  }

  const handleImageChange = async event => {
    setImage(event.target.files[0])
    await handleUpload(event.target.files[0])
  }

  const handleUpload = async image => {
    if (!image) {
      console.error('No image selected.')
      return
    }
    const formData = new FormData()
    formData.append('image', image)
    formData.append('album', albumId) // Add album ID to the FormData

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=682119ca03871d66524adbc2ef879271', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      console.log('Uploaded image', data)
      setImageUrl(data.data.url)
      notifyImageUrl(data.data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }
  // Function to read Blob from clipboard
  const readBlobFromClipboard = async () => {
    try {
      // Read data from clipboard
      const clipboardItems = await navigator.clipboard.read()

      // Loop through clipboard items
      for (const clipboardItem of clipboardItems) {
        // Check if the clipboard item is of type 'image/png' or 'image/jpeg'
        for (const type of clipboardItem.types) {
          if (type === 'image/png' || type === 'image/jpeg') {
            // Get the Blob data
            const blob = await clipboardItem.getType(type)
            // Return the Blob
            return blob
          }
        }
      }

      // If no image data found in clipboard
      console.log('No image found in clipboard')
      return null
    } catch (error) {
      // Handle clipboard read errors
      console.error('Error reading clipboard:', error)
      return null
    }
  }

  // Function to upload Blob to ImgBB API
  const uploadBlobToImgBB = async blob => {
    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append('image', blob, 'image.png') // Append Blob to FormData with a filename

      // Set your ImgBB API key
      const apiKey = '682119ca03871d66524adbc2ef879271'

      // Make a POST request to the ImgBB API
      const response = await fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
        method: 'POST',
        body: formData
      })

      // Parse the response as JSON
      const data = await response.json()

      // Check if the upload was successful
      if (data.success) {
        // Return the URL of the uploaded image
        return data.data.url
      } else {
        // Handle upload failure
        console.error('Failed to upload image:', data.error)
        return null
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error uploading image:', error)
      return null
    }
  }

  const FileUploader = ({ onChange }) => {
    const fileInputRef = useRef(null)

    const handleButtonClick = () => {
      fileInputRef.current.click()
    }

    const handleFileSelection = event => {
      const selectedFile = event.target.files[0]
      console.log('Selected file:', selectedFile)
      onChange(event)
      // You can now handle the selected file(s) as needed
    }

    return (
      <div>
        {/* Hidden file input */}
        <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelection} />
        {/* Button to trigger file input click */}
        <InputLabel htmlFor='file-input'>
          <Button
            variant='contained'
            component='span'
            style={{ color: 'white' }}
            size='small'
            onClick={handleButtonClick}
          >
            Upload
          </Button>
        </InputLabel>
      </div>
    )
  }

  return (
    <div>
      {/* <Input type="file" onChange={handleImageChange} /> */}
      {/* <Button onClick={handleUpload}>Upload</Button> */}
      <div style={{ display: 'flex', gap: '5px', padding: '5px' }}>
        <FileUploader onChange={handleImageChange} />
        <Button
          variant='contained'
          component='span'
          style={{ color: 'white' }}
          size='small'
          onClick={handleButtonClick}
        >
          Copy From Clipboard
        </Button>
      </div>

      {imageUrl && <img style={{ width: '300px' }} src={imageUrl} alt='Uploaded' />}
    </div>
  )
}

export default ImgBBUploader
