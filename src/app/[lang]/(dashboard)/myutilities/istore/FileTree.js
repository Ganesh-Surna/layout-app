import React, { useState } from 'react';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Button, Typography } from '@mui/material';
import defaultData from "./FileData.json"
const FileTree = ({ data=defaultData, onFileClick }) => {
  const renderTree = (node) => (
    <TreeItem key={node.folderId || node.fileId} nodeId={node.folderId || node.fileId} label={node.name || node.fileName}>
      {Array.isArray(node.subFolders) ? node.subFolders.map((subNode) => renderTree(subNode)) : null}
      {Array.isArray(node.files)
        ? node.files.map((file) => (
            <TreeItem
              key={file.fileId}
              nodeId={file.fileId}
              label={
                <Typography
                  onClick={() => onFileClick(file)}
                  style={{ cursor: 'pointer', color: file.isPublic ? 'green' : 'black' }}
                >
                  {file.fileName}
                </Typography>
              }
            />
          ))
        : null}
    </TreeItem>
  );

  return (
    <SimpleTreeView>
      {data?.folders?.map((rootNode) => renderTree(rootNode))}
    </SimpleTreeView>
  );
};

export default FileTree;
