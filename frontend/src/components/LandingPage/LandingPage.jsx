import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { accessSpots } from '../../store/spot';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'

const Landing = () => {
    const spots = useSelector(state => state.spotStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(accessSpots())
    }, [dispatch])

    // if (!spots) return null;

    return (
        <div className='allSpotsContain'>
            {Object.values(spots).map((spot) => (
                <div key={spot.id} className='oneSpotContain'>
                    <img className='image' src={spot.previewImage} alt={``} />
                    <div className='info'>
                        <p
                            className='name'
                            onClick={() => navigate(`spots/${spot.id}`)}
                        >{spot.name}</p>
                        <p className='location'>{spot.city}, {spot.state}</p>
                        <p className='price'>{`$${spot.price} / night`}</p>
                        <p>
                            <i className='fa-solid fa-star'></i>
                            {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : 'New'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Landing;
