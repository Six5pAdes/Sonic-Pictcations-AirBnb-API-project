import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { findOneSpot } from '../../store/spot';
import { useParams } from 'react-router-dom';
import ReviewList from '../Reviews/ReviewList';
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
            <div className='location' >
                <h2>{spot.name}</h2>
                <h3>{spot.city}, {spot.state}, </h3>
                <h3>{spot.country}</h3>
            </div>
            <div className='image-sec'>
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
                            avgStarRating={spot.avgStarRating}
                            numReviews={spot.numReviews}
                        />
                    </div>
                    <button id='reserve-button' onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>
            </div>
            <br />
            <ReviewInfo
                avgStarRating={spot.avgStarRating}
                numReviews={spot.numReviews}
            />
            <ReviewList spot={spot} />
        </div>
    )
}

const ReviewInfo = ({ numReviews, avgStarRating }) => {
    let ratingDisplay = avgStarRating > 0 ? avgStarRating.toFixed(1) : 'New';
    let sOrNot = numReviews !== 1 ? "s" : "";
    return (
        <p>
            <i className='fa-solid fa-ring'></i>&nbsp;
            {ratingDisplay}
            {numReviews !== 0 ? ` • ${numReviews} review${sOrNot}` : ''}
        </p>
    );
}

export default SpotDetails
