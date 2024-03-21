import { csrfFetch } from "./csrf.js";

const READ_REVIEWS = "reviews/READ_REVIEWS";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";

export const viewReviews = (reviews) => ({
  type: READ_REVIEWS,
  reviews,
});
export const createReview = (review) => ({
  type: CREATE_REVIEW,
  review,
});
export const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(viewReviews(data));
    return data;
  } else throw new Error("Cannot receive reviews at this time");
};

export const leaveReview = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application-json" },
    body: JSON.stringify(review),
  });
  if (response.ok) {
    const newReview = await response.json();
    dispatch(createReview(newReview));
    return newReview;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewId),
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  }
};

const initialState = {};

function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case READ_REVIEWS: {
      const newReviews = { ...state };
      try {
        action.reviews.Reviews.forEach(
          (eachReview) => (newReviews[eachReview.id] = eachReview)
        );
      } catch {
        console.error("Error fetching reviews");
      }
      return newReviews;
    }
    case CREATE_REVIEW: {
      return { ...state, [action.review.id]: action.review };
    }
    case REMOVE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
}

export default reviewReducer;
