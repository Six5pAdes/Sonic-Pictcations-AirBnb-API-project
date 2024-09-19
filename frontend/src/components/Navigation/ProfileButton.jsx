import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink, useNavigate } from 'react-router-dom'
import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()
  // const sessionUser = useSelector(state => state.session.user);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (
        ulRef.current &&
        !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false)

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu()
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id='prof-but' onClick={toggleMenu}>
        {user ? (
          <>
            <i className="fas fa-bars" />
            <i className="fas fa-user-circle" />
            <p className='menu-content'>My Profile</p>
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt" />
            <p className="greeting">Welcome! Sign in here.</p>
          </>
        )}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div id='profile-popup'>
            <li className='menu-content'>Hello, {user.firstName}
              <br />
              {user.email}
            </li>
            {/* <li>
              {sessionUser && (
                <div id='create-spot-link'>
                  <NavLink to='/spots/new' className='nav-link' >
                    Create a New Spot
                  </NavLink>
                </div>
              )}
            </li> */}
            <li>
              <NavLink className='nav-link' to='spots/current'>Manage Spots</NavLink>
              <br />
              <NavLink className='nav-link' to='reviews/current'>Manage Reviews</NavLink>
            </li>
            <li>
              <NavLink className='nav-link' onClick={logout}>Log Out</NavLink>
            </li>
          </div>
        ) : (
          <div id='popup'>
            <OpenModalMenuItem
              itemText='Log In'
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText='Sign Up'
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
