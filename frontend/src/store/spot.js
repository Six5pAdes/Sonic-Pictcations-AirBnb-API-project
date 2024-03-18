import { csrfFetch } from "./csrf.js";

const LOAD_SPOTS = "spots/getSpots";
// const FIND_SPOT = "spots/getSpot";
// const ADD_SPOT = "spots/addSpot";
// const EDIT_SPOT = "spots/";
// const REMOVE_SPOT = "spots/removeSpot";

const allSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const accessSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(allSpots(spots));
    return spots;
  }
};

const initialState = { spots: {} };

function spotReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state };
      action.spots.Spots.forEach((oneSpot) => {
        newState[oneSpot.id] = oneSpot;
      });
      return newState;
    }
    default:
      return state;
  }
}

export default spotReducer;
