import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
  featured: [],
  popular: [],
  tags: [],
  selectedThemeVideos: [],
  pagination: {
    all: {
      hasMore: false,
      page: 1,
    },
    featured: {
      hasMore: false,
      page: 1,
    },
    popular: {
      hasMore: false,
      page: 1,
    },
    themes: {
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
    case REQUESTS.VIDEOS.SUCCESS:
      // Setup pagination for videos
      LOG('video action', action);
      let allVideos = [];
      if (action.query.page && action.query.page > 1) {
        allVideos = state.all;
      }
      const allPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      allVideos = allVideos.concat(action.items || []);
      return {
        ...state,
        all: allVideos,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          all: allPagination,
        },
      };
    case REQUESTS.GET_TAGS.SUCCESS:
      return {
        ...state,
        tags: action.tags || [],
      };
    case REQUESTS.GET_FEATURED_VIDEOS.SUCCESS:
      // Setup pagination for videos
      let featuredVideos = [];
      if (action.query.page && action.query.page > 1) {
        featuredVideos = state.featured;
      }
      const featuredPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      featuredVideos = featuredVideos.concat(action.items || []);
      return {
        ...state,
        featured: featuredVideos,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          featured: featuredPagination,
        },
      };
    case REQUESTS.GET_POPULAR_VIDEOS.SUCCESS:
      // Setup pagination for videos
      let popularVideos = [];
      if (action.query.page && action.query.page > 1) {
        popularVideos = state.popular;
      }
      const popularPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      popularVideos = popularVideos.concat(action.items || []);
      return {
        ...state,
        popular: popularVideos,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          popular: popularPagination,
        },
      };
    case REQUESTS.GET_VIDEOS_BY_TAG.SUCCESS:
      // Setup pagination for videos
      let themesVideos = [];
      if (action.query.page && action.query.page > 1) {
        themesVideos = state.selectedThemeVideos;
      }
      const themesPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      themesVideos = themesVideos.concat(action.items || []);
      return {
        ...state,
        selectedThemeVideos: themesVideos,
        pagination: {
          ...state.pagination,
          themes: themesPagination,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
