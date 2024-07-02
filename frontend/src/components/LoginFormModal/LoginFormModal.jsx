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

  const disabledButton = () => {
    if (credential.length < 4 || password.length < 6) {
      return true;
    }
    return false;
  }

  const demoUser = () => {
    // e.preventDefault()
    setErrors({})
    return dispatch(
      sessionActions.login({ credential: "DemoUser", password: "password" })
    ).then(closeModal)
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      })
  }

  const badInfo = () => credential.length < 4 || password.length < 6

  return (
    <div className='login-modal'>
      <h1 className='login-header'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <label className='login-labels'>
          <input
            className='login-inputs'
            placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          // required
          />
        </label>
        <label className='login-labels'>
          <input
            className='login-inputs'
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          // required
          />
        </label>
        {errors.credential && (
          <p className='login-error' style={{ color: 'red' }}>{errors.credential}</p>
        )}
        {disabledButton() ?
          <button className='login-button' type="submit" disabled={badInfo()}>
            Log In
          </button>
          :
          <button className='login-success' type="submit" >Log In</button>
        }
        <button className='login-success' onClick={demoUser}>Demo User</button>
        <button className='login-success' onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
