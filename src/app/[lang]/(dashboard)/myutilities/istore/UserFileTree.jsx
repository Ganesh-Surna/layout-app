import React, { useState, useEffect } from 'react'
import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoIcon from '@mui/icons-material/Info'; // Importing an info icon
import EditIcon from '@mui/icons-material/Edit'; // Importing an edit icon
import * as FileUploader from '@/utils/awsS3Utils'
import * as GenUtils from "@/utils/genUtils"

import { useSession } from 'next-auth/react';
import {
  Button,
  Modal,
  IconButton,
  TextField,
  InputLabel,
  Grid,
  Box
} from '@mui/material'
import * as RestApi from '@/utils/restApiUtil'
import { API_URLS as ApiUrls } from '@/configs/apiConfig'
import { toast } from 'react-toastify'

const UserFileTree = ({ setTheFormValue, quiz = {}, setCurrentFileInfo,
   setFileName , createIStoreFile }) => {
  const [initialSelectedNodes, setInitialSelectedNodes] = useState(quiz?.contextIds?.split(',') || [])
  const [searchString, setSearchString] = useState('')
  const [searchFocusIndex, setSearchFocusIndex] = useState(0)
  const [searchFoundCount, setSearchFoundCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState([])

  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedNodeDetails, setSelectedNodeDetails] = useState(selectedNode?.details || '')
  const [selectedNodeTitle, setSelectedNodeTitle] = useState(selectedNode?.title || '');
  const [selectedNodeFileName, setSelectedNodeFileName] = useState(selectedNode?.fileName || '');

  const [treeData, setTreeData] = useState([
    {
      title: 'AUM (Root)',
      id: 'AUM',
      details: "Root folder",
      fileName: "",
      children: [
        {
          title: 'Insurance policies',
          details: "just description",
          fileName: "",
          id: "AUM_INSURANCE"
        },
        {
          title: 'Pending works',
          id: 'AUM_P_WORKS',
          details: " Upcoming works",
          children: [{ title: 'Ganitham', id: 'AUM_VSC_GNT' }]
        },
        {
          title: 'Current Works',
          id: 'AUM_WORK',
          details: "Current works.",
          children: [
            {
              title: 'Squizme',
              id: 'AUM_squizme',
            }
          ]
        }
      ]
    }
  ])
  //For lookup of data rather than recursive method...
  const [treeDataMap, setTreeDataMap] = useState([])
  const [rawTreeData, setRawTreeData] = useState([])
  const [addAsFirstChild, setAddAsFirstChild] = useState(false)

  const [copiedNode, setCopiedNode] = useState(null);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const [editingNode, setEditingNode] = useState(null); // State to track the node being edited

  const [tapTimeout, setTapTimeout] = useState(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const doubleTapDelay = 300; // time in milliseconds for double tap detection

  const [newTitle, setNewTitle] = useState('');
  const [popupOpen, setPopupOpen] = useState(false); // Manage popup visibility
  const [editPopupOpen, setEditPopupOpen] = useState(false); // Manage edit popup visibility

  const [MyFileExplorer, setMyFileExplorer] = useState();
  const { data: session } = useSession();

  const saveFileExplorer = async () => {
    console.log("Uploading Your File data to your user profile folder",
      FileUploader.userProfileBucketName);

    // Convert the tree data to a JSON string
    const jsonString = JSON.stringify(treeData, null, 2); // `null` for no replacer, `2` for pretty-printing
    console.log("Saving json file....", jsonString);
    var uploadResult = await FileUploader.uploadFileToS3({
      bucketName: FileUploader.userProfileBucketName,
      fileBuffer: jsonString,
      fileName: session.user.email + "/MyFileExplorer.json",
      fileType: "text/plain"
    }
    );
    console.log("FileUpload Result", uploadResult);

  }
  const loadFileExplorer = async () => {
    const currentTime = new Date().getTime(); // Get current timestamp

    try {
      const jsonData = await FileUploader.getJsonFileFromS3({
        bucketName: FileUploader.userProfileBucketName,
        fileName: session.user.email + "/" + "MyFileExplorer.json",
      });

      console.log("Loaded JSON data from S3:", jsonData);
      setTreeData(jsonData); // Assuming you have a state setter for your tree data
    } catch (error) {
      console.error("Error loading file explorer data:", error);
      toast.error(`Error loading data: ${error.message}`);
    }
  };

  const saveUserFile = () => {

  }

  const getUserFile = () => {

  }

  const exportTreeToJson = () => {
    // Convert the tree data to a JSON string
    const jsonString = JSON.stringify(treeData, null, 2); // `null` for no replacer, `2` for pretty-printing

    // Log the JSON string to the console (or use it as needed)
    console.log("Exported JSON:", jsonString);

    // Optional: You can create a Blob and trigger a download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'treeData.json'; // Name of the file to download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL
  };


  const handleCopyNode = (node, path) => {
   // console.log("node is",node, "deep copy of node is:",{...node})
    setCopiedNode({ ...node.node, children:[]} );
    console.log(" copy of node without children:",{ ...node.node, children:[]})
    setSelectedNode(node);
    setSelectedNodePath(path);
  };

  const handlePasteNode = (destinationPath) => {
    console.log("Destionation path is", destinationPath);
    if (!copiedNode || !destinationPath || destinationPath.length === 0) return;
    // Create a deep copy of the copied node to avoid reference issues
    const newNode = { ...copiedNode,
                        id: `${copiedNode.id}_copy_${Date.now()}` }; // Ensure a unique ID for the pasted node
    // Add the new node under the destination parent node
    const { treeData: updatedTree } = addNodeUnderParent({
      treeData,
      parentKey: destinationPath[destinationPath.length - 1],
      expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode,
    });

    setTreeData(updatedTree); // Update state with the new tree data

    // Optional: Remove the original node if necessary
    if (selectedNodePath) {
      const newTreeData = removeNodeAtPath({
        treeData: updatedTree,
        path: selectedNodePath,
        getNodeKey,
      }).treeData;

      setTreeData(newTreeData); // Update state with the node removed
    }

    setCopiedNode(null); // Clear the copied node
    setSelectedNodePath(null); // Clear the selected node path
  };

  const getNodeKey = ({ treeIndex }) => treeIndex


  const updateNodeFields = (nodes, targetId, updatedFields) => {
    return nodes.map((node) => {
      // If the current node matches the target ID, update its fields
      if (node.id === targetId) {

        // Generate a default filename if not set
        var filename = null;
        if(!node.fileName)
           filename = updatedFields.filename || `${node.id.replace(/\s+/g, '_').toLowerCase()}.json`;

        return {
          ...node,
          ...updatedFields,
          filename  // Ensure filename has a default value if not provided
        };
      }

      // If the node has children, traverse them
      if (node.children) {
        return {
          ...node,
          children: updateNodeFields(node.children, targetId, updatedFields)
        };
      }

      // Return the node unchanged if no updates are made
      return node;
    });
  };

  const updateNodeTitle = (nodes, targetId, newTitle) => {
    return nodes.map((node) => {
      // If the current node matches the target ID, update its title
      if (node.id === targetId) {
        return { ...node, title: newTitle };
      }

      // If the node has children, traverse them
      if (node.children) {
        return { ...node, children: updateNodeTitle(node.children, targetId, newTitle) };
      }

      // Return the node unchanged if no updates are made
      return node;
    });
  };


  const handleEditChange = (e, node, path) => {
    const newTitle = e.target.value;
    console.log("Changed title", newTitle,
      " of node:", node, "Selected node is", selectedNode)

    // Update the tree data using the recursive function
    const updatedTreeData = updateNodeTitle(treeData, selectedNode.id, newTitle);

    setTreeData(updatedTreeData); // Update the tree data with the new title
  };

  const saveNodeEdit = (node, path) => {
    setEditingNode(null); // Exit edit mode
    setNewTitle(''); // Reset newTitle after saving
    console.log('Node edit saved:', node); // Optional: Log the updated node for debugging
  };

  const cancelEdit = () => {
    setEditingNode(null); // Exit edit mode without saving changes
  };

  const handleNodeTouch = (node, path) => {
    const currentTime = Date.now();

    if (currentTime - lastTapTime < doubleTapDelay) {
      // Double tap detected
      setEditingNode(node); // Enter edit mode
      setLastTapTime(0); // Reset last tap time
    } else {
      setLastTapTime(currentTime);
      // Optionally handle single tap (e.g., selection)
      handleNodeSelect(node, path);
    }
  };

  const handleTouchEnd = (node, path) => {
    if (tapTimeout) {
      clearTimeout(tapTimeout); // Clear the timeout if it's still running
    }

    setTapTimeout(setTimeout(() => {
      handleNodeSelect(node, path); // Handle selection on single tap
    }, doubleTapDelay));
  };



  // Function to handle node info button click
  const handleInfoClick = (node) => {
    setSelectedNode(node); // Set the selected node
    setCurrentFileInfo(node);
    setFileName(node.fileName);
    //setPopupOpen(true); // Open the popup
  };

  // Function to handle edit button click
  const handleEditClick = (node) => {
    console.log("Node....",node)
    setSelectedNode(node); // Set the selected node
    setSelectedNodeTitle(node.title);
    setSelectedNodeDetails(node.details);
    setSelectedNodeFileName(node.fileName);
    //setNewTitle(node.title); // Pre-fill the title for editing
    setEditPopupOpen(true); // Open the edit popup
  };

  // Function to close edit popup
  const handleCloseEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedNode(null); // Clear selected node
    //setNewTitle(""); // Clear title input
  };

  // Function to handle edit submission
  const handleEditSubmit = () => {

    const updatedFields = {
      title: selectedNodeTitle,
      details: selectedNodeDetails,
      fileName: selectedNodeFileName
    };

    const updatedTreeData = updateNodeFields(treeData, selectedNode.id, updatedFields);
    setTreeData(updatedTreeData); // Update the state with the new tree data


    handleCloseEditPopup(); // Close the edit popup
  };

  const generateNodeProps = ({ node, path }) => {
    const isSelected = selectedNode && selectedNode.id === node.id; // Check if the current node is the selected node
    const isEditing = editingNode && editingNode.id === node.id; // Check if this node is being edited

    return {
      // onClick: () => handleRadioSelect({ node, path }),
      //canDrag: true,
      title: isEditing ? (
        <input
          type="text"
          value={node.title}
          onChange={(e) => handleEditChange(e, node, path)} // Handle input changes
          onBlur={() => saveNodeEdit(node, path)} // Save on blur (when clicking outside)
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveNodeEdit(node, path); // Save on Enter key
            } else if (e.key === 'Escape') {
              cancelEdit(); // Cancel edit on Escape key
            }
          }}
          autoFocus
          style={{
            width: '100%',
            padding: '2px',
            fontSize: '1.1rem',
          }}
        />
      ) : (
        <span
          onClick={() => handleNodeSelect(node, path)} // Handle node selection
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditingNode(node);
            setNewTitle(node.title); // Set the current title to input
          }}  // Enter edit mode on double-click
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleNodeTouch(node, path); // Use touch handler for double tap
          }}
          style={{
            fontSize: '1.1rem',
            backgroundColor: isSelected ? '#e0f7fa' : 'transparent',
            border: isSelected ? '2px solid #0288d1' : 'none',
            borderRadius: '4px',
            padding: '2px 4px',
            cursor: 'pointer',
          }}
        >
          {node.title}
        </span>
      ),

      buttons: [
        <IconButton
          key={`${path}-info`}
          onClick={() => handleInfoClick(node)} color="primary">
          <InfoIcon />
        </IconButton>,
        <IconButton key={`${path}-edit`}
          onClick={() => handleEditClick(node)} color="secondary">
          <EditIcon />
        </IconButton>,
        <IconButton
          key={`${path}-add`}
          onClick={async() => {
            var uid = GenUtils.getUniqueIdOfTimestamp();
            var fileName = `${node.title.replace(/\s+/g, '_')}_${uid}.istore`;
            await createIStoreFile(fileName);
            setTreeData(
              addNodeUnderParent({
                treeData,
                parentKey: path[path.length - 1],
                expandParent: true,
                getNodeKey,
                newNode: {
                  title: `${node.title}-subSubj`,
                  id: `${uid}`,
                  fileName:fileName,
                  details:""
                },
                addAsFirstChild,
              }).treeData
            );
          }}
          title="Add Child"
          size="small"
        >
          <AddIcon />
        </IconButton>,
        <IconButton
          key={`${path}-delete`}
          onClick={() => {
            setTreeData(
              removeNodeAtPath({
                treeData,
                path,
                getNodeKey,
              })
            );
          }}
          title="Delete Node"
          size="small"
        >
          <DeleteIcon />
        </IconButton>,
        <IconButton
          key={`${path}-copy`}
          onClick={() => handleCopyNode({ node, path })}
          title="Copy Node"
          size="small"
        >
          <ContentCopyIcon />
        </IconButton>,
        <IconButton
          key={`${path}-paste`}
          onClick={() => handlePasteNode(path)}
          title="Paste Node"
          size="small"
        >
          <ContentPasteIcon />
        </IconButton>
      ],
      onClick: (e) => {
        handleNodeSelect(node, path)
      },
      onDoubleClick: () => {
        setEditingNode(node)
      }
    }
  }


  const updateTreeData = (data, path, newChild) => {
    const updatedData = [...data]
    let currentNode = updatedData

    // Traverse the tree based on the path to reach the target node
    for (const index of path) {
      currentNode = currentNode[index]?.children // Check for undefined before accessing children
      if (!currentNode) {
        // Handle invalid path (optional: throw error, return early)
        return updatedData
      }
    }

    // Ensure children exist before pushing (initialize if necessary)
    currentNode.children = currentNode.children || []
    currentNode.children.push(newChild)

    return updatedData
  }


  const handleNodeSelect = (node, path) => {
    setSelectedNode(node)
    setCurrentFileInfo(node);
    setFileName(node.fileName);

    setSelectedNodeTitle(node.title);
    setSelectedNodeDetails(node.details);
    setSelectedNodeFileName(node.fileName);
    // console.log('Selected node', node, path)
  }

  const getChildrenForNode = (nodeId, treeData) => {
    var val = treeData.filter(node => node.parentContextId === nodeId)
    console.log('Children for nodeID:', nodeId, val)
    return val
  }

  const buildPartialTree = (rawTreeData, nodeId) => {
    const node = findContextById(nodeId)
    // console.log("Current node in partial tree.",nodeId,node)

    if (!node) {
      return null // Handle cases where node is not found
    }
    // console.log("Current node in partial tree.",node,rawTreeData)
    const children = getChildrenForNode(nodeId, rawTreeData)
    const childrenWithTree = children.map(child => buildPartialTree(rawTreeData, child.id)) // Recursively build child subtrees

    //node.expanded = true;
    toggleExpanded(node)
    return {
      ...node,
      children: childrenWithTree
    }
  }


  const toggleExpanded = node => {
    const newTreeData = [...treeData]
    const nodeIndex = newTreeData.findIndex(n => n.id === node.id)
    newTreeData[nodeIndex] = {
      ...node,
      expanded: !node.expanded
    }
    if (node.expanded) node.expanded = !node.expanded
    else node.expanded = true

    newTreeData.expanded = !node.expanded
    setTreeData(newTreeData)
  }

  const canDrop = ({ node, dragOverNode }) => {
    if (!dragOverNode) {
      return false
    }

    return dragOverNode.depth === 0
  }

  // Set initial checked nodes based on quiz contextIds
  useEffect(() => {
    if (quiz.contextIds && quiz.contextIds.length > 0) {
      setSelectedNodes(quiz.contextIds)
    }
  }, [quiz])

  useEffect(() => {
    // getData()
    loadFileExplorer();
    //For lookup of data rather than recursive method...
    const dataMap = new Map(treeData.map(item => [item.id, item]))
    console.log("Data Map...", dataMap)
    setTreeDataMap(dataMap);
  }, [])

  useEffect(() => {
    console.log('changed treeData....', treeData)
    setSelectedNodes(initialSelectedNodes)
    setTheFormValue('parentContextId', [])
  }, [treeData])


  // Function to close the popup
  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedNode(null); // Clear selected node
  };



  return (
    <div className='w-full'>
      <h2>User Files</h2>
      <Button variant="primary" onClick={saveFileExplorer}>Save Explorer</Button>
      <Button variant="primary" onClick={exportTreeToJson}>Export to JSON</Button>
      <form
        onSubmit={event => {
          event.preventDefault()
        }}
      >
      </form>


      <div style={{ height: 300, width: '100%' }}>
        {/* <SortableTree
          //nodeRenderer={CustomNodeRenderer}
          style={{
            // Inline style for immediate override
            '.rst__rowContents': { minWidth: '50px !important' }
          }}
          onNodeSelect={(node, path) => handleNodeSelect(node, path)}
          onClick={node => handleNodeClick(node)}
          treeData={treeData}
          onChange={setTreeData}
          generateNodeProps={generateNodeProps}
          canDrop={canDrop}
          //
          // Custom comparison for matching during search.
          // This is optional, and defaults to a case sensitive search of
          // the title and subtitle values.
          // see `defaultSearchMethod` in https://github.com/frontend-collective/react-sortable-tree/blob/master/src/utils/default-handlers.js
          searchMethod={customSearchMethod}
          //
          // The query string used in the search. This is required for searching.
          searchQuery={searchString}
          //
          // When matches are found, this property lets you highlight a specific
          // match and scroll to it. This is optional.
          searchFocusOffset={searchFocusIndex}
          //
          // This callback returns the matches from the search,
          // including their `node`s, `treeIndex`es, and `path`s
          // Here I just use it to note how many matches were found.
          // This is optional, but without it, the only thing searches
          // do natively is outline the matching nodes.
          searchFinishCallback={matches => {
            setSearchFoundCount(matches.length)
            setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0)
          }}
        /> */}

        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <div style={{ height: 300, width: '100%' }}>
            <SortableTree
              treeData={treeData}
              onChange={(newTreeData) => setTreeData(newTreeData)}
              generateNodeProps={generateNodeProps}
              //canDrop={canDrop}
              onMoveNode={({ node, nextPath, prevPath, treeData }) => {
                console.log('Moved node:', node);
                console.log('Previous path:', prevPath);
                console.log('Next path:', nextPath);
                setTreeData(treeData);
              }}
            // searchMethod={customSearchMethod}
            // searchQuery={searchString}
            // searchFocusOffset={searchFocusIndex}
            //   searchFinishCallback={matches => {
            //     setSearchFoundCount(matches.length);
            //    setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
            // }}
            />
          </div>
          {/* <SortableTree
            treeData={treeData}
            onChange={(newTreeData) => setTreeData(newTreeData)}
            onMoveNode={({ treeData }) => {
              console.log('Node moved:', treeData);
              setTreeData(treeData);
            }}
          /> */}
        </DndProvider>
      </div>
      {/* Popup Modal */}
      <Modal open={popupOpen} onClose={handleClosePopup}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '5px', maxWidth: '400px', margin: '100px auto' }}>
          <h2>Node Information</h2>
          {selectedNode && (
            <div>
              <p><strong>Title:</strong> {selectedNode.title}</p>
              <p><strong>ID:</strong> {selectedNode.id}</p>
              <p><strong>Additional Info:</strong> {selectedNode.details}</p>
              {/* Add more fields as necessary */}
            </div>
          )}
          <Button variant="contained" color="primary" onClick={handleClosePopup}>Close</Button>
        </div>
      </Modal>

      {/* Edit Popup Modal */}
      <Modal open={editPopupOpen} onClose={handleCloseEditPopup}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '5px', maxWidth: '400px', margin: '100px auto' }}>

          <Grid xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h2>Edit Node</h2>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Node Title"
                  value={selectedNodeTitle }
                  onChange={(e) => setSelectedNodeTitle(e.target.value)} // Update title state on change
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Node Details"
                  value={selectedNodeDetails }
                  onChange={(e) => setSelectedNodeDetails(e.target.value)} // Update title state on change
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="File Name"
                  value={selectedNodeFileName }
                  onChange={(e) => setSelectedNodeFileName(e.target.value)} // Update title state on change
                  fullWidth
                />

              </Grid>
              <Button variant="primary" color="primary" onClick={handleEditSubmit}>Save</Button>
              <Button variant="primary" color="primary" onClick={handleCloseEditPopup}>Cancel</Button>

            </Grid>
          </Grid>






        </div>
      </Modal>
    </div>
  )
}

export default UserFileTree
