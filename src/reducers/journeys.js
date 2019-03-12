import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  org: [],
  mine: [],
};

export default function adventures(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.journeys;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.GET_ORG_JOURNEYS.SUCCESS:
      return {
        ...state,
        org: action.organization_journeys,
      };
    case REQUESTS.GET_MY_JOURNEYS.SUCCESS:
      return {
        ...state,
        mine: action.journeys,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
