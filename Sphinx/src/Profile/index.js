import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function Profile() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <>
      <p>Email: {user.email}</p>
      <p>User ID: {user.uid}</p>
    </>
  );
}