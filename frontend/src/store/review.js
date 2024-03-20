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

const initialState = { spot: {}, user: {} };

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_REVIEWS: {
      const newState = {
        spot: { ...state.spot },
        user: { ...state.user },
      };
      action.reviews.Reviews.forEach((review) => {
        newState[review.id] = {
          reviewData: review,
          User: {
            userData: review.User,
          },
          ReviewImages: review.ReviewImages,
        };
        newState[review.id] = {
          reviewData: review,
          User: {
            userData: review.User,
          },
          Spot: {
            spotData: review.Spot,
          },
          ReviewImages: review.ReviewImages,
        };
      });
      return newState;
    }
    case CREATE_REVIEW: {
      const newState = {
        ...state,
        spot: { ...state.spot },
        user: { ...state.user },
      };
      newState.user[action.review.id] = action.review;
      return newState;
    }
    case REMOVE_REVIEW: {
      const newState = { ...state };
      delete newState[action.review.id];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
