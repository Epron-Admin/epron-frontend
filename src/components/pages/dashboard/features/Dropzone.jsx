import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept }) => {
  const { getRootProps, getInputProps, isDragActive, } = useDropzone({
    onDrop,
    accept
  });
  let inputProps = ({...getInputProps(), multiple:false})

  return (
    <div className="dropzone-div flex items-center justify-center" {...getRootProps()}>
      <input className="dropzone-input" {...inputProps} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop the files here</p>
        ) : (
          <p className="dropzone-content">
            Drag and drop the file here, or click to select a file
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;