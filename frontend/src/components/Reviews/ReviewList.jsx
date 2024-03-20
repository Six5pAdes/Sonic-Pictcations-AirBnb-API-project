import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../../store/review";
import { useEffect } from "react";
import ReviewForm from "./ReviewForm";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import { useModal } from "../../context/Modal";
import './ReviewList.css'

const formatDate = (date = new Date()) => {
    let month = date.getMonth()
    let year = date.getFullYear()

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return `${months[month]} ${year}`
}

const ReviewList = ({ spot }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const reviewObj = useSelector(state => state.reviewState[spot.id])
    const sessionObj = useSelector(state => state.session)

    const reviews = reviewObj ? Object.values(reviewObj) : []

    useEffect(() => {
        dispatch(fetchReviews(spot.id))
    }, [dispatch, spot.id])

    let ownerUser = sessionObj.user && sessionObj.user.id === spot.ownerId
    let reviewMessage = reviews.length === 0 && !ownerUser;
    const reviewGiven = reviews.some(review => sessionObj.user && review.userId === sessionObj.user.id)

    const handleDelete = review => {
        dispatch(deleteReview(spot.id, review))
        closeModal()
    }

    if (reviewMessage) {
        return <div id='list'>
            {
                (sessionObj.user && !ownerUser && !reviewGiven) &&
                <div id="review-button">
                    <OpenModalMenuItem
                        itemText='Post Your Review!'
                        modalComponent={<ReviewForm spot={spot} />}
                    />
                </div>
            }
            <p>Be the first to post a review!</p>
        </div>
    }

    return (
        <div id="list">
            {
                (sessionObj.user && !ownerUser && !reviewGiven) &&
                <div id="review-button">
                    <OpenModalMenuItem
                        itemText='Post Your Review!'
                        modalComponent={<ReviewForm spot={spot} />}
                    />
                </div>
            }
            <ul>
                {reviews.sort((s1, s2) => new Date(s2.createdAt) - new Date(s1.createdAt)).map((review = {}) => <li key={review.id}>
                    <div>
                        <div>{review.User.firstName}</div>
                        <div>{formatDate(new Date(review.createdAt))}</div>
                        <div>{review.review}</div>
                        {(sessionObj.user && review.userId === sessionObj.user.id) && (
                            <OpenModalMenuItem
                                itemText='Delete'
                                modalComponent={(
                                    <div id="delete-options">
                                        <h2>Confirm Delete</h2>
                                        <span>Are you sure you want to delete this review?</span>
                                        <button id="delete-confirm" type="button" onClick={() => handleDelete(review)}>Yes (Delete Review)</button>
                                        <button id="delete-cancel" type="button" onClick={{ closeModal }}>No (Keep Review)</button>
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </li>
                )}
            </ul>
        </div>
    )
}

export default ReviewList
