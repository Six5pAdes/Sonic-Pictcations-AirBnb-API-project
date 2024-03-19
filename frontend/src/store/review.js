// import { csrfFetch } from "./csrf.js";

// const READ_REVIEWS = "reviews/READ_REVIEWS";
// const CREATE_REVIEW = "reviews/CREATE_REVIEW";
// const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";

// export const viewReviews = (spotId, reviews) => ({
//   type: READ_REVIEWS,
//   reviews,
//   spotId,
// });
// export const createReview = (spotId, review) => ({
//   type: CREATE_REVIEW,
//   review,
//   spotId,
// });
// export const removeReview = (spotId, review) => ({
//   type: REMOVE_REVIEW,
//   review,
//   spotId,
// });

// export const fetchReviews = (spotId) => async (dispatch) => {
//   const response = await fetch(`/api/spots/${spotId}/reviews`);
//   const data = await response.json();
//   dispatch(viewReviews(spotId, data));
//   return { data };
// };

// export const leaveReview = (spotId, review) => async (dispatch) => {
//   const response = await fetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     headers: { "Content-Type": "application-json" },
//     body: JSON.stringify(review),
//   });
//   const newReview = await response.json();
//   dispatch(createReview(spotId, newReview));
//   dispatch();
//   return { review: newReview };
// };

// export const deleteReview = (spotId, review) => async (dispatch) => {
//   await csrfFetch(`/api/reviews/${review.id}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ reviewId: review.id }),
//   });
//   dispatch(removeReview(spotId, review));
// };

// const reviewReducer = (state = {}, action) => {
//   switch (action.type) {
//     case READ_REVIEWS: {
//       const newState = { ...(state[action.spotId] || {}) };
//       for (let review of action.reviews) newState[review.id] = review;
//       return { ...state, [action.spotId]: newState };
//     }
//     case CREATE_REVIEW: {
//       const newState = { ...(state[action.spotId] || {}) };
//       newState[action.review.id] = action.review;
//       return { ...state, [action.spotId]: newState };
//     }
//     case REMOVE_REVIEW: {
//       const newState = { ...(state[action.spotId] || {}) };
//       delete newState[action.review.id];
//       return { ...state, [action.spotId]: newState };
//     }
//     default:
//       return state;
//   }
// };
