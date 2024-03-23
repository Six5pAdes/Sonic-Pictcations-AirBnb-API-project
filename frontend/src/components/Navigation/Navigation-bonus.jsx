import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='navbar-full'>
      <li id='navbar-left'>
        <NavLink to="/">
          <img id='logo' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1710891390/Sonic_channel_ztj6xl.png' href='/' />
        </NavLink>
        <h1 className='site-title'>Sonic Pict-cations</h1>
      </li>
      <li id='navbar-right'>
        <ul>
          <div id='prof-button'>
            {sessionUser && (
              <NavLink to='/spots/new' id='navlink-right'>
                Create a new Spot
              </NavLink>
            )}
          </div>
          {isLoaded && (
            <div>
              <ProfileButton id='prof-but' user={sessionUser} />
            </div>
          )}
        </ul>
      </li>
    </ul>
  );
}

export default Navigation;
