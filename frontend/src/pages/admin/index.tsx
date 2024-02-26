/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-array-index-key */
// import {  ref as storageRef } from 'firebase/storage';
// import { useUploadFile } from 'react-firebase-hooks/storage';
// import { useState } from 'react';
// import { storage } from '../../../firebase';
// import UploadButton from '@/components/ui/upload-button';

// const UploadFile = () => {
//     const [uploadFile, uploading, snapshot, error] = useUploadFile();
//     const ref = storageRef(storage, 'file.jpg');
//     const [selectedFile, setSelectedFile] = useState<File>();
  
//     const upload = async () => {
//       if (selectedFile) {
//         const result = await uploadFile(ref, selectedFile, {
//           contentType: 'image/jpeg'
//         });
//         alert(`Result: ${JSON.stringify(result)}`);
//       }
//     }
  
//     return (
//       <div>
//         <p>
//           {error && <strong>Error: {error.message}</strong>}
//           {uploading && <span>Uploading file...</span>}
//           {snapshot && <span>Snapshot: {JSON.stringify(snapshot)}</span>}
//           {selectedFile && <span>Selected file: {selectedFile.name}</span>}
//           <input
//             type="file"
//             onChange={(e) => {
//               const file = e.target.files ? e.target.files[0] : undefined;
//               setSelectedFile(file);
//             }}
//           />
//           <button onClick={upload} type='button'>Upload file</button>
//         </p>
//       </div>
//     )
//   }

//   export default UploadFile

import { useEffect, useState } from 'react';
import Dropzone from '@/components/shared/dropzone';


 const Page=()=> {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);


  // Function to handle the change in uploaded files
  const handleFileChange: React.Dispatch<React.SetStateAction<string[]>> = (
    newState: React.SetStateAction<string[]>
  ) => {
    setUploadedFiles(newState);
  };

  // remove this useEffect hook if you don't need to do anything with the uploaded files
  useEffect(() => {
    console.log(uploadedFiles);
  }, [uploadedFiles]);

  return (
    <div className="p-5">
      <div>
        <h1>File Upload</h1>
        <Dropzone
          onChange={handleFileChange} // Pass the handler function
          className="your-custom-class" // Optional: Add any custom class
          fileExtension="jpg" // Set the expected file extension
        />
        {uploadedFiles.length > 0 && (
          <div>
            <h2>Uploaded Files:</h2>
            <ul>
              {uploadedFiles.map((file, index) => (
		<img key={index} src={file} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page