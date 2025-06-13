// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// export default function FileUpload() {
//   return (
//     <Button
//       component="label"
//       role={undefined}
//       variant="contained"
//       tabIndex={-1}
//       startIcon={<CloudUploadIcon />}
//     >
//       Upload files
//       <VisuallyHiddenInput
//         type="file"
//         onChange={(event) => console.log(event.target.files)}
//         multiple
//       />
//     </Button>
//   );
// }

import React, { useState } from 'react';

const FileUpload = ({ onFileSelect, selectedFile, accept = "image/*", className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (file) => {
    if (file) {
      onFileSelect(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        
        // Clean up previous preview URL
        return () => URL.revokeObjectURL(previewUrl);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const removeFile = () => {
    onFileSelect(null);
    setFilePreview(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={` text-center transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {!selectedFile ? (
          <>
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                /> */}
              </svg>
              {/* <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse from your device
              </p> */}
              <label className="cursor-pointer">
                 <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block">
                  Browse
                </span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            {filePreview ? (
              <div className="flex justify-center">
                <img
                  src={filePreview}
                  alt="File preview"
                  className="max-h-32 max-w-full rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="text-center">
              <p className="font-medium text-gray-700 truncate max-w-xs mx-auto">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-2">
              <label className="cursor-pointer">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors duration-200 inline-block">
                  Change
                </span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={removeFile}
                className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

