import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';


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
      };
    case REQUESTS.GET_TAGS.SUCCESS:
      console.warn('tags, check action:', action);
      return {
        ...state,
        tags: action || [],
      };
    case REQUESTS.GET_FEATURED_VIDEOS.SUCCESS:
      return {
        ...state,
        featured: action.items || [],
      };
    case REQUESTS.GET_POPULAR_VIDEOS.SUCCESS:
      return {
        ...state,
        popular: action.items || [],
      };
    case REQUESTS.GET_VIDEOS_BY_TAG.SUCCESS:
      console.warn('selected theme, check action:', action);
      return {
        ...state,
        selectedThemeVideos: action || [],
      };
    default:
      return state;
  }
}
