import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="sign-up">
      <center>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} >
         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
         <button type="submit">Log In</button>
      {error && <p>{error.message}</p>}
    </form>
    </center>
    </div> 
    
  );
}