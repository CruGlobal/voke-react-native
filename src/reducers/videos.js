import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
  featured: [],
  popular: [],
  tags: [],
  selectedThemeVideos: [],
  channelVideos: [],
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
    channel: {
      type: 'all',
      hasMore: false,
      page: 1,
    },
  },
};

function getChannelVideos(state, action, type) {
  let channelVideos = [];
  if (state.pagination.channel.type === type) {
    if (action.query.page && action.query.page > 1) {
      if (type === 'popular' && action.query.popularity) {
        channelVideos = state.channelVideos;
      } else if (type === 'featured' && action.query.featured) {
        channelVideos = state.channelVideos;
      } else if (type === 'all' && !action.query.featured && !action.query.popularity) {
        channelVideos = state.channelVideos;
      } else if (type === 'themes') {
        channelVideos = state.channelVideos;
      }
    }
  }
  channelVideos = channelVideos.concat(action.items || []);
  return channelVideos;
}

export default function videos(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.videos;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
        pagination: {
          ...state.pagination,
          ...(incoming.pagination || {}),
        },
        channelVideos: [],
        selectedThemeVideos: [],
      };
    case REQUESTS.VIDEOS.SUCCESS:
      // Setup pagination for videos
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
    // Channel Requests with paging built in
    case REQUESTS.ORGANIZATION_VIDEOS.SUCCESS:
      // Setup pagination for videos
      const channelVideos = getChannelVideos(state, action, 'all');
      const channelPagination = {
        type: 'all',
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      return {
        ...state,
        channelVideos,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          channel: channelPagination,
        },
      };
    case REQUESTS.GET_POPULAR_ORGANIZATION_VIDEOS.SUCCESS:
      // Setup pagination for videos
      const channelVideosPopular = getChannelVideos(state, action, 'popular');
      const channelPaginationPopular = {
        type: 'popular',
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      return {
        ...state,
        channelVideos: channelVideosPopular,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          channel: channelPaginationPopular,
        },
      };
    case REQUESTS.GET_FEATURED_ORGANIZATION_VIDEOS.SUCCESS:
      // Setup pagination for videos
      const channelVideosFeatured = getChannelVideos(state, action, 'featured');
      const channelPaginationFeatured = {
        type: 'featured',
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      return {
        ...state,
        channelVideos: channelVideosFeatured,
        selectedThemeVideos: [],
        pagination: {
          ...state.pagination,
          channel: channelPaginationFeatured,
        },
      };
    case REQUESTS.GET_ORGANIZATION_VIDEOS_BY_TAG.SUCCESS:
      // Setup pagination for videos
      const channelVideosTheme = getChannelVideos(state, action, 'themes');
      const channelPaginationTheme = {
        type: 'themes',
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      return {
        ...state,
        channelVideos: [],
        selectedThemeVideos: channelVideosTheme,
        pagination: {
          ...state.pagination,
          channel: channelPaginationTheme,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
