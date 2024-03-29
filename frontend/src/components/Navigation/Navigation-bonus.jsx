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
          <img id='logo' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1710891390/Sonic_jul_2015_ztj6xl.png' href='/' />
        </NavLink>
        <NavLink to='/' className='site-title'>Sonic Pict-cations</NavLink>
      </li>
      <li id='navbar-right'>
        <div id='nav-links-contain'>
          <ul>
            {sessionUser && (
              <div id='create-spot-link'>
                <NavLink to='/spots/new' id='navlink-right' >
                  Create a new Spot
                </NavLink>
              </div>
            )}
            {isLoaded && (
              <div>
                <ProfileButton user={sessionUser} />
              </div>
            )}
          </ul>
        </div>
      </li>
    </ul>
  );
}

export default Navigation;
