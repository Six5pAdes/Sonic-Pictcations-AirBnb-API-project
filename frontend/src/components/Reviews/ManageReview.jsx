import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchUserReviews, deleteReview } from "../../store/review";
import EditReview from "./EditReview";
import "./ManageReview.css";

const formatDate = (date = new Date()) => {
    let month = date.getMonth()
    let year = date.getFullYear()

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return `${months[month]} ${year}`
}

const ManageReview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(fetchUserReviews());
    }, [dispatch]);

    const userId = useSelector((state) =>
        state.session.user ? state.session.user.id : null
    );
    const sessionObj = useSelector((state) => state.session.user);
    const reviews = useSelector((state) =>
        Object.values(state.reviewStore).filter(
            (review) => review.userId === userId
        )
    );

    if (!userId) navigate("/");

    const handleDelete = (review) => {
        dispatch(deleteReview(review.id));
        closeModal();
    };

    return (
        <div id="this-review">
            <h1 id="curr-title">Manage Reviews</h1>
            <ul id="reviews">
                {reviews.map((review) => (
                    <div key={review?.id} className="review">
                        <h3
                            className="spot-name"
                            onClick={() => navigate(`/spots/${review?.Spot?.id}`)}
                        >{review?.Spot?.name}</h3>
                        <div className="spot-date">{formatDate(new Date(review?.createdAt))}</div>
                        <p className="review-comments">{review?.review}</p>
                        {sessionObj?.id === review?.User?.id && (
                            <div className="edit-or-delete">
                                <OpenModalMenuItem
                                    itemText='Edit'
                                    className='edit-button'
                                    modalComponent={<EditReview reviewId={review.id} />}
                                />
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
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default ManageReview;
