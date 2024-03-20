import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../context/Modal'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import { accessSpots, deleteSpot } from '../../store/spot'
import '../LandingPage/LandingPage.css'
import './CurrentSpot.css'

const ManageSpot = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { closeModal } = useModal()

    useEffect(() => {
        dispatch(accessSpots())
    }, [dispatch])

    const userId = useSelector(state => state.session.user ? state.session.user.id : null)
    const spots = useSelector(state => Object.values(state.spots).filter(spot => spot.ownerId === userId))

    if (!userId) navigate('/')

    const handleUpdate = spotId => {
        navigate(`/spots/${spotId}/edit`)
    }
    const handleDelete = spotId => {
        dispatch(deleteSpot(spotId))
        closeModal()
    }

    return (
        <div id='this-spot'>
            <h1>Manage Your Spots</h1>
            <button type='button' onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            <br />
            <ul id='spots'>
                {spots.map((spot) => {
                    <div key={spot.id} className='spot-card'>
                        <div
                            title={spot.name}
                            onClick={() => navigate(`/spots/${spot.id}`)}
                            key={spot.id}>
                            <img
                                src={spot.previewImage}
                                className='spot-img' />
                            <div className='spot-info'>
                                <p>{spot.city}, {spot.state}</p>
                                <p>
                                    <i className='fa-solid fa-ring'></i>
                                    {spot.avgRating}
                                </p>
                            </div>
                            <p className='price'>${spot.price} a night</p>
                        </div>
                        <div className='edit-or-delete'>
                            <button type='button' onClick={() => handleUpdate(spot.id)}>Update</button>
                            <OpenModalMenuItem
                                itemText='Delete'
                                modalComponent={(
                                    <div id='confirm-delete'>
                                        <h2>Confirm Delete</h2>
                                        <span>Are you sure you want to remove this spot?</span>
                                        <button id='delete-complete' type='button' onClick={() => handleDelete(spot.id)}>Yes (Delete Spot)</button>
                                        <button id='delete-cancel' type='button' onClick={{ closeModal }}>No (Keep Spot)</button>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                })}
            </ul>
        </div>
    )
}

export default ManageSpot
