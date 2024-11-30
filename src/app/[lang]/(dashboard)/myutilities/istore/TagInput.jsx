import { Cancel } from '@mui/icons-material'
import { Box, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'

const Tag = ({ label, onDelete }) => {
  return (
    <Box
      sx={{
        background: '#283240',
        height: '100%',
        width: '100%',
        display: 'flex',
        padding: '0.4rem',
        margin: '0 0.5rem 0 0',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff'
      }}
    >
      <Typography>{label}</Typography>
      <Cancel sx={{ cursor: 'pointer', marginLeft: '0.5rem' }} onClick={onDelete} />
    </Box>
  )
}

export default function TagInput() {
  const [tags, setTags] = useState([])
  // const tagRef = useRef()
  const [inputValue, setInputValue] = useState('')

  const handleDelete = index => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    // const newTag = tagRef.current.value.trim()
    const newTag = inputValue.trim()
    if (newTag !== '' && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      // tagRef.current.value = ''
      setInputValue('')
    }
  }

  // const handleInputChange = () => {
  //   // Check if input field is empty
  //   if (tagRef.current.value === '') {
  //     // Remove the last tag if there are tags present
  //     if (tags.length > 0) {
  //       const newTags = [...tags]
  //       newTags.pop() // Remove the last tag
  //       setTags(newTags)
  //     }
  //   }
  // }

  // const onkeydown = e => {
  //   if (e.keycode === 8) {
  //     console.log('delete')
  //   }
  // }

  // const handleInputKeyPress = event => {
  //   console.log(event.key)
  //   // Add tag when Enter or comma is pressed
  //   if (event.key === 'Enter' || event.key === ',') {
  //     event.preventDefault() // Prevent default behavior (form submission)
  //     addTag()
  //   } else if (event.key === 'Backspace') {
  //     // event.preventDefault();
  //     // Check if input field is empty
  //     if (tagRef.current.value === '') {
  //       // Remove the last tag if there are tags present
  //       if (tags.length > 0) {
  //         const newTags = [...tags]
  //         newTags.pop() // Remove the last tag
  //         setTags(newTags)
  //       }
  //     }
  //   }
  // }

  // const addTag = () => {
  //   const newTag = tagRef.current.value.trim()
  //   if (newTag !== '' && !tags.includes(newTag)) {
  //     setTags([...tags, newTag])
  //     tagRef.current.value = ''
  //   }
  // }

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  const handleInputKeyPress = event => {
    // const inputValue = event.target.value

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault() // Prevent default behavior (e.g., form submission)
      addTag()
    } else if (event.key === 'Backspace') {
      if (inputValue === '') {
        // Remove the last tag if the input is empty
        if (tags.length > 0) {
          const newTags = [...tags]
          newTags.pop()
          setTags(newTags)
        }
      }
    }
  }

  const addTag = () => {
    const newTag = inputValue.trim()
    if (newTag !== '' && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setInputValue('') // Clear input after adding tag
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleOnSubmit}>
        <div style={{ display: 'flex', overflow: 'auto', padding: '10px', margin: '5px' }}>
          {tags.map((tag, index) => (
            <Tag key={index} label={tag} onDelete={() => handleDelete(index)} />
          ))}
        </div>

        <TextField
          // inputRef={tagRef}
          fullWidth
          variant='standard'
          size='small'
          sx={{ margin: '1rem 0' }}
          placeholder={tags.length < 5 ? 'Enter tags (backspace to remove)' : ''}
          onChange={handleInputChange}
          multiLine={true}
          onKeyDown={handleInputKeyPress}
          //onKeyPress={}
          InputProps={{
            startAdornment: ''
          }}
        />
      </form>
    </Box>
  )
}
