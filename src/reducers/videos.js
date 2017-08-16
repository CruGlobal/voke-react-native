import { REHYDRATE } from 'redux-persist/constants';
import { GET_ALL_VIDEOS, GET_TAGS, GET_FEATURED, GET_POPULAR, GET_SELECTED_THEME } from '../constants';

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
    case GET_ALL_VIDEOS:
      return {
        ...state,
        all: action.all || [],
      };
    case GET_TAGS:
      return {
        ...state,
        tags: action.tags || [],
      };
    case GET_FEATURED:
      return {
        ...state,
        featured: action.featured || [],
      };
    case GET_POPULAR:
      return {
        ...state,
        popular: action.popular || [],
      };
    case GET_SELECTED_THEME:
      return {
        ...state,
        selectedThemeVideos: action.selectedThemeVideos || [],
      };
    default:
      return state;
  }
}
