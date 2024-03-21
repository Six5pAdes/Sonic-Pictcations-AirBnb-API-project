import { csrfFetch } from "./csrf.js";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const FIND_SPOT = "spots/FIND_SPOT";
const ADD_SPOT = "spots/ADD_SPOT";
const EDIT_SPOT = "spots/EDIT_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";

const allSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});
const oneSpot = (spot) => ({
  type: FIND_SPOT,
  spot,
});
const updateSpot = (spot) => ({
  type: EDIT_SPOT,
  spot,
});
const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

export const accessSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(allSpots(spots));
    return spots;
  }
};

export const findOneSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(oneSpot(spot));
    return spot;
  }
};

export const createSpot = (spot, spotImg) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const newSpot = await response.json();
    newSpot.spotImg = [];

    for (let index = 0; index < spotImg.length; index++) {
      const imgResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: newSpot.id,
          url: spotImg[index],
          preview: true,
        }),
      });

      if (imgResponse.ok && imgResponse.status !== 404) {
        const newImg = await imgResponse.json();
        newSpot.spotImg.push(newImg);
      }
    }
    dispatch(findOneSpot(newSpot));
    return newSpot;
  }
};

export const editSpot = (spotFix, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify(spotFix),
  });
  if (response.ok) {
    const reSpot = await response.json();
    dispatch(updateSpot(reSpot));
    return reSpot;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) dispatch(removeSpot(spotId));
};

const initialState = {};

function spotReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state };
      action.spots.Spots.forEach((oneSpot) => {
        newState[oneSpot.id] = oneSpot;
      });
      return newState;
    }
    case FIND_SPOT: {
      return { ...state, [action.spot.id]: action.spot };
    }
    case ADD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case EDIT_SPOT: {
      return { ...state, [action.spot.id]: action.spot };
    }
    case REMOVE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    default:
      return state;
  }
}

export default spotReducer;
