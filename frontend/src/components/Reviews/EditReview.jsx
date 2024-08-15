import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from '../../context/Modal'
import { editReview } from "../../store/review";
import { findOneSpot } from "../../store/spot";
import StarsRatingInput from "./StarsInput";
import './ReviewForm.css'

const EditReview = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.user)
    const [reviewText, setReviewText] = useState(currentUser.review || "")
    const [stars, setStars] = useState(currentUser.stars || null)
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
        const result = await dispatch(
            editReview(updatedReview, spotId)
        );
        if (result.errors) {
            setErrors("Failed to update the review");
        } else {
            closeModal();
            dispatch(findOneSpot(spotId));
        }
    }

    const disabled = reviewText.length < 10 || stars === null;

    return (
        <div id="review-contain">
            <h2>Edit Your Review</h2>
            {errors && (<p>{errors}</p>)}
            <form onSubmit={handleSubmit} id="review-form">
                <textarea
                    placeholder="Edit your review here (at least 10 characters)..."
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
