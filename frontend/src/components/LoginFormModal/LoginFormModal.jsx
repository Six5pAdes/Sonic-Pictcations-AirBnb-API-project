import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className='login-modal'>
      <h1 className='login-header'>Log In</h1>
      {errors.credential && (
        <p className='login-error' style={{ color: 'red' }}>{errors.credential}</p>
      )}
      <form className='login-form' onSubmit={handleSubmit}>
        <label className='login-labels'>
          <input
            className='login-inputs'
            placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login-labels'>
          <input
            className='login-inputs'
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          className={(credential.length < 4 || password.length < 6)
            ? 'login-button'
            : 'login-button-allowed'}
          type="submit"
          disabled={credential.length < 4 || password.length < 6}>
          Log In
        </button>
        <button className='login-button-allowed' onClick={() => {
          setCredential('Demo-lition')
          setPassword('password')
        }}>
          Log in as a Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
