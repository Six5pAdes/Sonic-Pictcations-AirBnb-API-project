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
        <div className='all-spots-contain'>
            {Object.values(spots).map((spot) => (
                <div
                    key={spot.id}
                    className='one-spot-contain'
                    title={spot.name}
                    onClick={() => navigate(`/spots/${spot.id}`)}
                >
                    <img
                        className='image'
                        src={spot.previewImage}
                    />
                    <p className='name'>{spot.name}</p>
                    <div className='info'>
                        <p className='location'>{spot.city}, {spot.state}</p>
                        <p className='price'>{`$${spot.price} / night`}</p>
                        <br />
                        <p className='avg-rate'>
                            <i className='fa-solid fa-ring'></i>&nbsp;
                            {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : 'New'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Landing;
