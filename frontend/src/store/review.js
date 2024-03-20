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
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  dispatch(viewReviews(spotId, data));
  return data;
};

export const leaveReview = (spotId, review) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application-json" },
    body: JSON.stringify(review),
  });
  const newReview = await response.json();
  dispatch(createReview(newReview));
  return newReview;
};

export const deleteReview = (review) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${review.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId: review.id }),
  });
  dispatch(removeReview(review));
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_REVIEWS: {
      if (!Array.isArray(action.reviews)) {
        return state; // Return the current state if reviews are not in the expected format
      }
      const newState = {};
      action.reviews.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    }
    case CREATE_REVIEW: {
      const spotId = action.review.spotId;
      const newReview = action.review;
      const updatedSpotReview = state[spotId]
        ? [...state[spotId], newReview]
        : [newReview];
      return {
        ...state,
        [spotId]: updatedSpotReview,
      };
    }
    case REMOVE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
