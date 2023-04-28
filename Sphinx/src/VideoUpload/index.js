import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage , auth} from '../firebase';

export default function VideoUpload() {
  const [user] = useAuthState(auth);
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    // Upload the video to Firebase Storage
    const storageRef = storage.ref();
    const videoRef = storageRef.child(`${user.uid}/${video.name}`);
    const uploadTask = videoRef.put(video);

    // Update the progress bar as the upload progresses
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    });

    // Once the upload is complete, store the video URL in the user's profile information
    await uploadTask;
    const videoUrl = await videoRef.getDownloadURL();
    // Store the video URL in the user's profile information using Firebase's updateProfile method
    await auth.currentUser.updateProfile({
      photoURL: videoUrl,
    });
  };

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      {progress > 0 && <progress value={progress} max="100" />}
    </>
  );
}