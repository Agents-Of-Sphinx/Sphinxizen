import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Footer from '../footer/index';

export default function Profile() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <>
      <div className='Profile'>
      <p>Email: {user.email}</p>
      <p>User ID: {user.uid}</p>
      </div>
      <Footer/>
    </>
  );
}