import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal'
import { editReview } from "../../store/review";
import { findOneSpot } from "../../store/spot";
import StarsRatingInput from "./StarsInput";
import './ReviewForm.css'

const EditReview = ({ reviewId }) => {
    const dispatch = useDispatch()
    const currReview = useSelector(state => state.reviewStore[reviewId])
    const [reviewText, setReviewText] = useState(currReview.review || "")
    const [stars, setStars] = useState(currReview.stars || null)
    const [errors, setErrors] = useState("")
    const [spot, setSpot] = useState({})
    const { closeModal } = useModal()

    useEffect(() => {
        if (currReview) {
            setReviewText(currReview.review);
            setStars(currReview.stars);
            dispatch(findOneSpot(currReview.spotId)).then(res => setSpot(res));
        }
    }, [currReview, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        const updatedReview = {
            review: reviewText,
            stars: stars,
        };
        const result = await dispatch(editReview(reviewId, updatedReview));
        if (result.errors) {
            setErrors("Failed to update the review");
        } else {
            closeModal();
            dispatch(findOneSpot(currReview.spotId));
        }
    };

    const disabled = reviewText.length < 10 || stars === null;

    return (
        <div id="review-contain">
            <h2>How was your stay at {spot.name}?</h2>
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
                    Update Your Review
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="success"
                >
                    Cancel Your Update
                </button>
            </form>
        </div>
    );
}

export default EditReview

/*
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import { editReview } from "../../store/review";
import { findOneSpot } from "../../store/spot";
import StarsRatingInput from "./StarsInput";
import './ReviewForm.css';

const EditReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const review = useSelector(state => state.reviewStore[reviewId]);
    const { closeModal } = useModal();
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(null);
    const [errors, setErrors] = useState("");

    useEffect(() => {
        if (review) {
            setReviewText(review.review);
            setStars(review.stars);
        }
    }, [review]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        const updatedReview = {
            review: reviewText,
            stars: stars,
        };
        const result = await dispatch(editReview(reviewId, updatedReview));
        if (result.errors) {
            setErrors("Failed to update the review");
        } else {
            closeModal();
            dispatch(findOneSpot(review.spotId));
        }
    };

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
                    Update Your Review
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="success"
                >
                    Cancel Your Update
                </button>
            </form>
        </div>
    );
};

export default EditReview;
*/
