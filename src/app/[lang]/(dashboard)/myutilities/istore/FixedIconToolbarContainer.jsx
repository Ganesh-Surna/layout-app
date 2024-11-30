import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import ShareButton from './ShareButton.jsx'
import ShareIcon from '@mui/icons-material/Share'
import CloseIcon from '@mui/icons-material/Close'

import CommandBox from './CommandBox'
import { TextField, InputAdornment, useTheme, useMediaQuery, Box, Button } from '@mui/material'

const useStyles = {
  appBar: {
    top: 0,
    bottom: 'auto'
  },
  iconButton: {
    marginRight: '10px',
    backgroundColor: 'cyan'
  },
  title: {
    flexGrow: 1
  }
}

const FixedIconToolbarContainer = ({ title, currentFileInfo,iconData, searchQuery, handleSearchChange, children }) => {
  const theme = useTheme()
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'))
  const isBelowXs = useMediaQuery(theme.breakpoints.down('xs'))

  const [searchVisible, setSearchVisible] = useState(false)
  const classes = useStyles

  const toggleSearch = () => {
    setSearchVisible(prev => !prev)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reduced shadow for a sleeker look
        borderBottom: '2px solid #dee2e6' // Bottom border for distinction
      }}
    >
      <Typography
        variant='h6'
        color='primary'
        sx={{
          padding: '4px 0', // Add padding for spacing
          borderRadius: '8px', // Increased border-radius for a softer look
          // color: 'black',
          fontWeight: 600, // Bold for better emphasis
          border: `1px solid ${theme.palette.primary.main}`,
          // background: `${theme.palette.primary.main}`,
          textAlign: 'center', // Centered text
          position: 'relative' // Ensure it follows the regular flow
        }}
        className={classes.title}
      >
        Title:{currentFileInfo?.title}
      </Typography>
      <div style={{ padding: '0px', backgroundColor: 'white',
       borderRadius: '5px', maxWidth: '400px', margin: 'auto' }}>
          {currentFileInfo && (
            <div>
            <p><strong>File Name:</strong> {currentFileInfo?.fileName}</p>
              <p><strong>Details</strong> {currentFileInfo?.details}</p>
              {/* Add more fields as necessary */}
            </div>
          )}
        </div>

      <div style={{ position: 'sticky', width: '100%', top: 0 }}>
        <Toolbar
          style={{
            display: 'flex',
            gap: '10px',
            width: '100%'
          }}
        >
          <div className='flex justify-between w-full'>
            {iconData.map((item, index) => (
              <Box key={index} className='flex items-center gap-1'>
                <IconButton
                  style={{
                    backgroundColor: `${theme.palette.primary.main}`,
                    color: 'white',
                    // backgroundColor: item.backgroundColor,
                    transition: 'background-color 0.3s, transform 0.2s',
                    borderRadius: '50%', // Make buttons circular
                    '&:hover': {
                      backgroundColor: '#e0e0e0' // Change color on hover
                    }
                  }}
                  className={classes.iconButton}
                  color='inherit'
                  aria-label={item.ariaLabel}
                  onClick={item.onClick}
                >
                  {item.icon}
                </IconButton>
                {!isBelowSm && (
                  <span
                    onClick={item.onClick}
                    style={{
                      fontSize: '1rem',
                      cursor: 'pointer',
                      color: '#343a40', // Darker text for better contrast
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#007bff' // Change color on hover
                      }
                    }}
                  >
                    {item.ariaLabel}
                  </span>
                )}
              </Box>
            ))}
            <Button
              variant='contained'
              size='small'
              style={{
                backgroundColor: `${theme.palette.primary.main}`, // Use a specific color
                // backgroundColor: '#1976d2', // Use a specific color
                color: '#fff', // Text color
                borderRadius: '4px',
                display: 'flex', // Use flex to align icon and text
                alignItems: 'center', // Center items vertically
                gap: '5px', // Space between icon and text
                transition: 'background-color 0.3s, transform 0.2s',
                cursor: 'pointer' // Change cursor to pointer for better UX
              }}
              onClick={() => shareContent(title)}
              startIcon={<ShareIcon />} // Use startIcon prop for icon placement
            >
              Share
            </Button>
            {isBelowSm && ( // Display search button only on small screens
              <IconButton
                color='primary'
                style={{
                  borderRadius: '50%',
                  transition: 'background-color 0.3s'
                }}
                onClick={toggleSearch} // Add toggle function for search
              >
                {searchVisible ? <CloseIcon /> : <SearchIcon />} {/* Toggle icon */}
              </IconButton>
            )}
          </div>
        </Toolbar>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            margin: '1px'
          }}
        >
          {/* Always visible search bar for larger screens */}
          <TextField
            label='Search...'
            value={searchQuery}
            onChange={handleSearchChange}
            variant='outlined'
            size='small'
            style={{
              flex: isBelowSm && !searchVisible ? 0 : 1, // Hide input on small screens if not visible
              display: isBelowSm && !searchVisible ? 'none' : 'flex' // Toggle display based on state
            }}
            InputProps={{
              style: { borderRadius: '4px' }
            }}
          />
        </div>
      </div>

      <div style={{ height: '72vh', overflowY: 'auto', width: '100%', padding: '8px 0' }}>{children}</div>
    </div>
  )
}

export default FixedIconToolbarContainer
