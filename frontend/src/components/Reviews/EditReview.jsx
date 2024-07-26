import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal'
import { editReview } from "../../store/review";
import { findOneSpot } from "../../store/spot";
import StarsRatingInput from "./StarsInput";
import './ReviewForm.css'

const EditReview = ({ reviewId, initialReview = '', initialRating, spotId }) => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.user)
    const [reviewText, setReviewText] = useState(initialReview)
    const [stars, setStars] = useState(initialRating)
    const [errors, setErrors] = useState("")
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors('')
        const updatedReview = {
            review: reviewText,
            stars: stars,
            spotId: spotId,
            userId: currentUser.id
        }
        return await dispatch(editReview(updatedReview, reviewId))
            .then(closeModal)
            .then(() => dispatch(findOneSpot(spotId)))
            .catch(async () => {
                setErrors("Server currently down, please try again later")
            })
    }

    const disabled = reviewText.length < 10 || stars === null;

    return (
        <div id="review-contain">
            <h2>Edit Your Review</h2>
            {errors && (<p>{errors}</p>)}
            <form onSubmit={handleSubmit} id="review-form">
                <textarea
                    placeholder="Edit your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    id="full-review"
                />
                <StarsRatingInput setStars={setStars} stars={stars} />
                <button
                    type="submit"
                    disabled={disabled}
                    onClick={handleSubmit}
                    className={disabled ? "disabled" : "success"}
                >
                    Submit Your Review
                </button>
            </form>
        </div>
    )
}

export default EditReview
