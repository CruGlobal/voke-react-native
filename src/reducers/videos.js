import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
  featured: [],
  popular: [],
  tags: [],
  selectedThemeVideos: [],
};

export default function videos(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.videos;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.VIDEOS.SUCCESS:
      return {
        ...state,
        all: action.items || [],
        selectedThemeVideos: [],
      };
    case REQUESTS.GET_TAGS.SUCCESS:
      return {
        ...state,
        tags: action.tags || [],
      };
    case REQUESTS.GET_FEATURED_VIDEOS.SUCCESS:
      return {
        ...state,
        featured: action.items || [],
        selectedThemeVideos: [],
      };
    case REQUESTS.GET_POPULAR_VIDEOS.SUCCESS:
      return {
        ...state,
        popular: action.items || [],
        selectedThemeVideos: [],
      };
    case REQUESTS.GET_VIDEOS_BY_TAG.SUCCESS:
      return {
        ...state,
        selectedThemeVideos: action.items || [],
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
