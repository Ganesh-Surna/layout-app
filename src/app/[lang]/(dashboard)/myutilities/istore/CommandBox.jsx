import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import classes from './CommandBox.module.css'
import { Avatar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import MediaPreview from './MediaPreview'

const CommandBox = ({ handleClickOpen, deleteItem, editItem, cloneItem, ...data }) => {
  const {
    id,
    order = '0',
    title,
    content,
    description,
    index,
    mediaUrl = 'https://fakeimg.pl/250x100/',
    mediaType = 'image'
  } = data

  return (
    // <Draggable draggableId={id+""} index={index}>
    // {(provided) => (
    //   <div
    //     ref={provided.innerRef}
    //     {...provided.draggableProps}
    //     {...provided.dragHandleProps}
    //   >
    <div>
      <span role='figure' className={classes.command} style={{ position: 'relative' }}>
        <div className={classes.command__box}>
          <div className={classes.title}>
            <div className={classes.title_slot_left}>
              <Avatar sx={{ backgroundColor: '#ccc' }}>{index}</Avatar> {/* Circle with number */}
              {title}
            </div>
            <div className={classes.title_slot_right}>
              <div className={classes.command__box__icon__container}>
                <IconButton
                  aria-label='edit'
                  onClick={() => {
                    if (editItem) editItem(index)
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton aria-label='copy' onClick={() => cloneItem(index)}>
                  <FileCopyIcon />
                </IconButton>
                <IconButton aria-label='delete' onClick={() => deleteItem(index)}>
                  <DeleteIcon></DeleteIcon>
                </IconButton>
                <CopyToClipboard text={content}>
                  <IconButton aria-label='copy to clipboard'>
                    <ContentCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className={classes.command__box__body}>
            <pre>
              <code
                className='language-bash'
                style={{ color: 'white', background: 'rgba(0,0,0,0.1)', textWrap: 'wrap' }}
              >
                {content}
              </code>
            </pre>
          </div>
          <MediaPreview mediaUrl={mediaUrl} mediaType={mediaType}></MediaPreview>
          <span className={classes.description}>{description}</span>
        </div>
      </span>
    </div>
    // </div>
    //   )}
    // </Draggable>
  )
}

export default CommandBox
