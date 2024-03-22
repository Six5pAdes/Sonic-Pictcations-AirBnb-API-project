import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal'
import { useParams } from 'react-router-dom'
import { leaveReview } from "../../store/review";
import StarsRatingInput from "./StarsInput";
import './ReviewForm.css'

const ReviewForm = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const [reviewText, setReviewText] = useState("")
    const [stars, setStars] = useState(null)
    const [errors, setErrors] = useState("")
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors('')
        const review = { review: reviewText, stars }
        return await dispatch(leaveReview(spotId, review))
            .then(closeModal)
            .catch(async () => {
                setErrors("Server currently down, please try again later")
            })
    }

    const disabled = reviewText.length < 10 || stars === null;

    return (
        <form onSubmit={handleSubmit} id="review-form">
            <h2>How was your stay?</h2>
            {errors && (<p>{errors}</p>)}
            <textarea
                placeholder="Leave your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                // required
                id="full-review"
            />
            <StarsRatingInput setStars={setStars} stars={stars} />
            <button
                type="submit"
                disabled={disabled}
                onClick={handleSubmit}
                id="submit-button"
            >
                Submit Your Review
            </button>
        </form>
    )
}

export default ReviewForm
