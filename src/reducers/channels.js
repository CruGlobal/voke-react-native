import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
  featured: [],
  browse: [],
  myChannels: [],
  pagination: {
    all: {
      hasMore: false,
      page: 1,
    },
    featured: {
      hasMore: false,
      page: 1,
    },
    browse: {
      hasMore: false,
      page: 1,
    },
    myChannels: {
      hasMore: false,
      page: 1,
    },
  },
};

export default function channels(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.videos;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.GET_ORGANIZATIONS.SUCCESS:
      // Setup pagination for videos
      let allOrganizations = [];
      if (action.query.page && action.query.page > 1) {
        allOrganizations = state.all;
      }
      const allPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      allOrganizations = allOrganizations.concat(action.organizations || []);
      return {
        ...state,
        all: allOrganizations,
        pagination: {
          ...state.pagination,
          all: allPagination,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
