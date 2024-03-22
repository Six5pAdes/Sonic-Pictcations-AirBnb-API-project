import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../../store/review";
import { useEffect } from "react";
import { useParams } from 'react-router-dom'
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import ReviewForm from "./ReviewForm";
import './ReviewList.css'

const formatDate = (date = new Date()) => {
    let month = date.getMonth()
    let year = date.getFullYear()

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return `${months[month]} ${year}`
}

const ReviewList = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const { closeModal } = useModal()
    const reviewObj = useSelector(state => state.reviewStore)
    const sessionObj = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])

    const handleDelete = review => {
        dispatch(deleteReview(review.id))
        closeModal()
    }

    const reviews = Object.values(reviewObj)
        .filter(review => review.spotId === parseInt(spotId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const isOwner = sessionObj && reviews.length > 0 && reviews[0].User && sessionObj.id === reviews[0].User.id

    // if (!reviews.length) {
    //     return <div id='list'>
    //         <div id="review-button">
    //             <OpenModalMenuItem
    //                 itemText='Post Your Review!'
    //                 modalComponent={<ReviewForm spotId={spotId} />}
    //             />
    //         </div>
    //         <p>Be the first to post a review!</p>
    //     </div>
    // }

    return (
        <section>
            <div id='list'>
                {!isOwner && (
                    <div id="review-button">
                        <OpenModalMenuItem
                            itemText='Post Your Review!'
                            modalComponent={<ReviewForm spotId={spotId} />}
                        />
                    </div>
                )}
                {reviews.length === 0 && <p>Be the first to post a review!</p>}
            </div>
            <div id="reviews-container">
                {reviews.map((review) => (
                    <div key={review?.id} className="review">
                        <h3 className="review-name">{review.User?.firstName}</h3>
                        <div>{formatDate(new Date(review?.createdAt))}</div>
                        <p className="review-comments">{review?.review}</p>
                        {sessionObj?.id === review?.User?.id && (
                            <OpenModalMenuItem
                                itemText='Delete'
                                className='delete-button'
                                modalComponent={
                                    <div id='confirm-delete'>
                                        <h2>Confirm Delete</h2>
                                        <span>Are you sure you want to delete this review?</span>
                                        <button id='delete-complete' type="button" onClick={() => handleDelete(review)}>Yes (Delete Review)</button>
                                        <button id='delete-cancel' type="button" onClick={closeModal}>No (Keep Review)</button>
                                    </div>
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ReviewList
