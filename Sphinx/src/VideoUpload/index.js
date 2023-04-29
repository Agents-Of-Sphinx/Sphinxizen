import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function VideoUpload() {
  // State to store uploaded file
  const [file, setFile] = useState("");

  // State to store upload progress
  const [percent, setPercent] = useState(0);

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a video first!");
      return;
    }
  
    try {
      const storageRef = ref(storage, `/files/${file.name}`);
  
      // Progress can be paused and resumed. It also exposes progress updates.
      // Receives the storage reference and the file to upload.
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
  
          // Update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        async () => {
          // Get download URL
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(url);
          } catch (err) {
            console.log(err);
            alert("Error getting download URL");
          }
        }
      );
    } catch (err) {
      console.log(err);
      alert("Error uploading file");
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleChange} accept="video/mp4" />
      <button onClick={handleUpload}>Upload to Firebase</button>
      <p>{percent}% done</p>
    </div>
  );
}

export default VideoUpload;
