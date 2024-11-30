import React, { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TextField, InputAdornment, useTheme } from '@mui/material'
import TagInput from './TagInput.jsx'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FixedIconToolbarContainer from './FixedIconToolbarContainer.jsx'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import CommandBox from './CommandBox.jsx'
import AddIcon from '@mui/icons-material/Add'
import ImgBBUploader from './ImgBBUploader.jsx'
import commandData from './commandData.json'
import './IStore.css'
import useElementRef from './useElementRef.jsx'
import UserFileTree from './UserFileTree.jsx'
import * as FileUploader from '@/utils/awsS3Utils'
import { useSession } from 'next-auth/react';
import useUUID from '@/app/hooks/useUUID.js'

export const ItemTypes = {
  COMMAND: 'command'
}

const IStore = params => {
  const { uuid, regenerateUUID } = useUUID()
  const inputRef = useElementRef()
  const theme = useTheme()

  const defaultParams = {
    data: {
      id: uuid,
      title: '',
      content: '',
      description: '',
      mediaType: 'image',
      mediaUrl: 'https://fakeimg.pl/350x200/?text=TriesolTech&font=lobster',
      encoded: 'false',
      lang: '',
      tags: '',
      duration: 1,
      status: '',
      owner: '',
      createdBy: '',
      order: '1'
    }
  }

  const [pData, setPData] = useState(params.content ? params.content : defaultParams.data.content)
  //const [pObjData, setPObjData] = useState(params?.data ? params.data : defaultParams.data)
  const [pObjData, setPObjData] = useState(() => params?.data ? params.data : defaultParams.data);

  const [addFormData, setAddFormData] = useState(defaultParams.data)
  const [editIndex, setEditIndex] = useState(null) // Index of the command being edited
  //const [editFormData, setEditFormData] = useState(defaultParams.data);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);
  // Function to submit the edit form
  const handleEditFormSubmit = () => {
    if (editIndex !== null) {
      const updatedCommands = [...commands]
      updatedCommands[editIndex] = addFormData
      setCommands(updatedCommands)
      setEditIndex(null)
    }
  }

  const [editingMode, setEditingMode] = useState(false)
  const [openAddEdit, setOpenAddEdit] = useState(false)
  const [commands, setCommands] = useState(commandData)
  const [fileName, setFileName] = useState('Untitled.istore')
  const ref = useRef(null)
  const { data: session } = useSession();

  useEffect(() => {
    const handleKeyPress = event => {
      // Check if the pressed key is a functional key
      if (event.key === 'F10') {
        // Handle the functional key press
        console.log('F10 key pressed')
        // You can perform any desired actions here
        // Open a popup
        window.open('https://www.squizme.com', 'popup', 'width=600,height=400')
      }
    }

    // Attach event listener when component mounts
    document.addEventListener('keydown', handleKeyPress)

    // Detach event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const triggerKeyPress = (key = 'F12', keyCode = 123) => {
    // Checking if the ref is defined
    if (ref.current) {
      ref.current.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: { key },
          keyCode: keyCode
        })
      )
      console.log('dispatched keyevent....')
    }
  }

  const reorderCommands = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }
    const newCommands = reorderCommands(commands, result.source.index, result.destination.index)
    setCommands(newCommands)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false)
  }

  const handleParamChange = event => {
    const { name, value } = event.target
    setPObjData({ ...pObjData, [name]: value })
  }

  const handleAddParamChange = event => {
    const { name, value } = event.target
    setAddFormData({ ...addFormData, [name]: value })
  }

  const handleAddSave = e => {
    e.preventDefault()
    if (editingMode)
      if (editIndex != null) {
        handleEditFormSubmit()
      } else {
        const newCommand = { ...addFormData, id: commands.length + 1 }
        setCommands(prevCommands => [...prevCommands, newCommand])
        setAddFormData({
          id: '',
          order: '',
          title: '',
          content: '',
          description: '',
          mediaType: 'image',
          mediaUrl: ''
        })
      }
    setOpenAddEdit(false)
  }

  const handleSaveParams = () => {
    // You can add further logic here if needed, e.g., validation
    setPData(pObjData.content) // Update pData with the new content
    setOpen(false)
  }

  const handleAddClick = () => {
    console.log('Add clicked')
    // Add your logic here
    regenerateUUID()
    setEditingMode(false)
    setOpenAddEdit(true)
  }

  const handleSaveClick = async () => {
    await saveIStoreFile(fileName, commands)
  }

  const loadIStoreFile = async (fileName) => {
    setFileName(fileName)
    try {
      const jsonData = await FileUploader.getJsonFileFromS3({
        bucketName: FileUploader.userProfileBucketName,
        fileName: session.user.email + "/iStore/" + fileName,
      });

      console.log("Loaded iStore data from S3:", jsonData);
      //var finalResult = JSON.parse(jsonData)
      setCommands(jsonData)
      // setTreeData(jsonData); // Assuming you have a state setter for your tree data
    } catch (error) {
      console.error("Error loading iStore file:", error);
      //toast.error(`Error loading data: ${error.message}`);
    }
  };

  const createIStoreFile = async (fileName) => {
    console.log("Uploading Your File data to your user profile folder",
      FileUploader.userProfileBucketName);
    var jsonString = "[{\"id\":1,\"order\":1,\"title\":\"<<title>>\",\"content\":\"About me\",\"description\":\"description\",\"mediaType\":\"image\",\"mediaUrl\":\"\"}]";
    // Convert the tree data to a JSON string
    // const jsonString = JSON.stringify(treeData, null, 2); // `null` for no replacer, `2` for pretty-printing
    console.log("Saving iStore file....", jsonString);
    var uploadResult = await FileUploader.uploadFileToS3({
      bucketName: FileUploader.userProfileBucketName,
      fileBuffer: jsonString,
      fileName: session.user.email + "/iStore/" + fileName,
      fileType: "text/plain"
    }
    );
    console.log("FileUpload Result", uploadResult);

  }

  const saveIStoreFile = async (fileName, jsonData) => {
    console.log("Uploading Your File data to your user profile folder",
      FileUploader.userProfileBucketName);
    // Convert the tree data to a JSON string
    const jsonString = JSON.stringify(jsonData, null, 2); // `null` for no replacer, `2` for pretty-printing
    console.log("Saving iStore file....", jsonString);
    var uploadResult = await FileUploader.uploadFileToS3({
      bucketName: FileUploader.userProfileBucketName,
      fileBuffer: jsonString,
      fileName: session.user.email + "/iStore/" + fileName,
      fileType: "text/plain"
    }
    );
    console.log("FileUpload Result", uploadResult);

  }



  const handleAddClose = () => {
    console.log('Add Closed')
    // Add your logic here
    setOpenAddEdit(false)
  }

  // Function to remove a command based on index
  const removeCommand = indexToRemove => {
    setCommands(prevCommands => {
      const updatedCommands = [...prevCommands]
      updatedCommands.splice(indexToRemove, 1)
      return updatedCommands
    })
  }

  const exportToJSON = () => {
    const jsonData = JSON.stringify(commands, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName ? fileName : 'info.istore'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const openFileDialog = () => {
    // Trigger file selection window
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'istore'
    input.onchange = handleFileChange
    input.click()
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    console.log(file)
    if (!file) return // If no file selected, do nothing
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      const fileContent = e.target.result
      try {
        const jsonData = JSON.parse(fileContent)
        console.log('Settign commands...', commands)
        setCommands(jsonData)
      } catch (error) {
        console.error('Error parsing JSON file:', error)
      }
    }

    reader.readAsText(file)
  }

  // Array of icon data objects
  const iconData = [
    {
      icon: <FolderOpenIcon />,
      edge: 'start',
      ariaLabel: 'Open File',
      onClick: openFileDialog,
      backgroundColor: 'orange'
    },

    {
      icon: <SaveOutlinedIcon />,
      edge: 'end',
      ariaLabel: 'Save',
      onClick: handleSaveClick,
      backgroundColor: 'orange'
    },
    {
      icon: <UpgradeIcon />,
      edge: 'end',
      ariaLabel: 'Export',
      backgroundColor: 'orange',
      onClick: exportToJSON
    },

    {
      icon: <AddIcon />,
      edge: 'end',
      ariaLabel: 'Add New Info',
      backgroundColor: 'orange',
      onClick: handleAddClick
    }
    // {
    //   icon:<ShareIcon/>,
    //   edge:"end",
    //   ariaLabel:"Share",
    //   onClick: shareIT,
    // }
  ]

  // Function to open the edit form for a command
  const openEditForm = index => {
    const commandToEdit = commands[index]
    setEditIndex(index)
    setEditingMode(true)
    setAddFormData(commandToEdit)
    setOpenAddEdit(true)
  }

  // Function to handle cloning a command
  const handleCloneCommand = index => {
    var commandToClone = commands[index]
    var clonedCommand = { ...commandToClone } // Create a shallow copy of the command
    //regenerateUUID();
    clonedCommand.id = regenerateUUID()
    console.log('Generated new for command id uuid', clonedCommand.id)

    setCommands(prevCommands => {
      const updatedCommands = [...prevCommands]
      updatedCommands.splice(index + 1, 0, clonedCommand) // Add the cloned command next to the original one
      //updatedCommands.map((item))
      return updatedCommands
    })
  }

  const [searchQuery, setSearchQuery] = useState('')

  // Function to handle search query change
  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  const setTheFormValue = (name, val) => {
    //setValue(name, val, { shouldValidate: true, shouldDirty: true })
  }

  // Function to filter commands based on search query
  const filteredCommands = commands.filter(command => {
    const regex = new RegExp(searchQuery, 'i') // Case-insensitive search
    return regex.test(command.title) || regex.test(command.content) || regex.test(command.description)
  })

  return (
    <>
      <UserFileTree setCurrentFileInfo={setCurrentFileInfo}
        createIStoreFile={createIStoreFile}
        setFileName={loadIStoreFile}
        setTheFormValue={setTheFormValue}>
      </UserFileTree>
      <FixedIconToolbarContainer
        iconData={iconData}
        currentFileInfo={currentFileInfo}
        title={fileName}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      >

        <div
          style={{
            height: '100%',
            overflow: 'auto',
            width: '100%'
          }}
          id='builderId'
          ref={inputRef}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: 'white'
            }}
          >

            {/* <Banner  delay="0s" /> First banner */}
            {/* <Banner delay="20s" /> Second banner with a delay of 10s */}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='commands'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {/* <TimerApp displayAs="toolbar"></TimerApp> */}
                  {filteredCommands.map((command, index) => (
                    <Draggable key={String(command.id)} draggableId={String(command.id)} index={index}>
                      {provided => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <CommandBox
                            {...command}
                            index={index}
                            deleteItem={removeCommand}
                            editItem={openEditForm}
                            cloneItem={handleCloneCommand}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Dialog open={openAddEdit} onClose={handleCloseAddEdit} id='addDialog'>
            <DialogTitle>{editingMode ? 'Edit Info' : 'Add Info'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin='dense'
                id='id'
                name='id'
                label='ID'
                type='text'
                fullWidth
                disabled
                value={uuid}
              //value={getId()}
              />
              <TextField
                margin='dense'
                id='newtitle'
                name='title'
                label='Title'
                type='text'
                fullWidth
                required
                value={addFormData.title}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='newcontent'
                name='content'
                label='Content'
                type='text'
                fullWidth
                multiline
                value={addFormData.content}
                onChange={handleAddParamChange}
              />

              <TextField
                margin='dense'
                id='newdescription'
                name='description'
                label='Description'
                type='text'
                fullWidth
                maxRows={2}
                maxWidth={200}
                value={addFormData.description}
                onChange={handleAddParamChange}
              />

              <TextField
                margin='dense'
                id='newcreatedBy'
                name='createdBy'
                label='Created By'
                type='text'
                fullWidth
                value={addFormData.createdBy}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='newowner'
                name='owner'
                label='Owner'
                type='text'
                fullWidth
                value={addFormData.owner}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='duration'
                name='duration'
                label='Duration(min)'
                type='number'
                fullWidth
                maxRows={2}
                maxWidth={200}
                value={addFormData.duration}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='status'
                name='status'
                label='Status'
                type='text'
                fullWidth
                maxRows={2}
                maxWidth={200}
                value={addFormData.status}
                onChange={handleAddParamChange}
              />

              <TagInput
                margin='dense'
                id='tags'
                name='tags'
                label='Tags'
                type='text'
                fullWidth
                value={addFormData.tags}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='mediatype'
                name='mediaType'
                label='Media Type'
                type='text'
                fullWidth
                maxRows={2}
                maxWidth={200}
                value={addFormData.mediaType}
                onChange={handleAddParamChange}
              />
              <TextField
                margin='dense'
                id='mediaUrl'
                name='mediaUrl'
                label='Media Url'
                type='url'
                fullWidth
                value={addFormData.mediaUrl}
                onChange={handleAddParamChange}
              />
              {/* <RecordMediaRecorder/> */}
              {/* <PasteFromClipboard></PasteFromClipboard> */}
              <ImgBBUploader
                notifyImageUrl={imgUrl => {
                  var event = { target: { name: 'mediaUrl', value: imgUrl } }
                  handleAddParamChange(event)
                }}
              />
              {/* <RecordMediaRecorder/> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddClose}>Cancel</Button>
              <Button onClick={handleAddSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      </FixedIconToolbarContainer>
    </>
  )
}

export default IStore
