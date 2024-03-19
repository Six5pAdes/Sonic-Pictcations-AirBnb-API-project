import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { findOneSpot } from '../../store/spot';
import { useParams } from 'react-router-dom';
import './SingleSpot.css'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotObj = useSelector(state => state.spotStore)
    const spot = spotObj[spotId]

    useEffect(() => {
        dispatch(findOneSpot(spotId))
    }, [dispatch, spotId])

    if (!spot || !spot.SpotImages) return null;

    return (
        <div className='single-spot'>
            <div className='info' >
                <h2>{spot.name}</h2>
                <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            </div>
            <div className='image'>
                {spot.SpotImages.map((image, n) =>
                    <img src={image.url} key={image.id} className={`spot-image-${n}`} />
                )}
            </div>
            <div className='extraInfo' >
                <div className='desc'>
                    <h3>Hosted by: {spot.Owner.firstName} {spot.Owner.lastName} </h3>
                    <p>{spot.description}</p>
                </div>
                <div className='callout'>
                    <div className='cashNView'>
                        <p>${spot.price} / night</p>
                        <ReviewInfo
                            numReviews={spot.numReviews}
                            avgRating={spot.avgRating}
                        />
                    </div>
                    <button onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>
            </div>
            <ReviewInfo
                numReviews={spot.numReviews}
                avgRating={spot.avgRating}
            />
            <ReviewInfo spot={spot} />
        </div>
    )
}

const ReviewInfo = ({ numReviews, avgRating }) => {
    let amount = numReviews === 1 ? "" : "s"
    return <p>
        <i className='fa-solid fa-star'></i>
        {avgRating} {numReviews !== 0 ? ` • ${numReviews} review${amount}` : null}
    </p>
}

export default SpotDetails
