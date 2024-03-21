import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='navbar-left'>
      <li>
        <NavLink to="/">
          <img id='logo' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1710891390/Sonic_channel_ztj6xl.png' href='/' />
        </NavLink>
        <h1>Sonic Pict-cations</h1>
      </li>
      <li>
        <ul id='navbar-right'>
          {sessionUser && (
            <li>
              <NavLink to='/spots/new' id='navlink-right'>
                Create a new Spot
              </NavLink>
            </li>
          )}
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}

        </ul>
      </li>
    </ul>
  );
}

export default Navigation;
