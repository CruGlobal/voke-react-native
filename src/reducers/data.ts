import { REDUX_ACTIONS } from '../constants';
import lodash from 'lodash';
import { exists } from '../utils';

export type DataKeys =
  | 'availableAdventures'
  | 'allVideos'
  | 'featuredVideos'
  | 'popularVideos'
  | 'favoriteVideos'
  | 'videoTags'
  | 'searchVideos'
  | 'myAdventures'
  | 'adventureSteps'
  | 'adventureStepMessages'
  | 'notifications'
  | 'adventureInvitations';

const initialState = {
  dataChangeTracker: {
    /*
    Used to log/track if data in any of related deep objects changed.
    This makes easy to update the components when really needed
    without deep comparison of the objects to see changes.
    */
    notifications: 0,
    myAdventures: 0,
    adventureInvitations: 0,
    availableAdventures: 0,
    adventureSteps: 0,
    adventureStepMessages: 0,
    allVideos: 0,
    featuredVideos: 0,
    favoriteVideos: 0,
  },
  notifications: [],
  notificationPagination: { hasMore: false, page: 1 },
  unReadBadgeCount: 0,
  availableAdventures: [],
  myAdventures: [],
  adventureInvitations: [],
  adventureSteps: {},
  adventureStepMessages: {},
  allVideos: [],
  featuredVideos: [],
  popularVideos: [],
  favoriteVideos: [],
  searchVideos: [],
  videoTags: [],
  videoPagination: {
    All: {
      hasMore: false,
      page: 1,
    },
    Featured: {
      hasMore: false,
      page: 1,
    },
    Popular: {
      hasMore: false,
      page: 1,
    },
    Search: {
      hasMore: false,
      page: 1,
    },
    Favorite: {
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

export default function(state = initialState, action: any) {
  switch (action.type) {
    case REDUX_ACTIONS.SET_DATA:
      console.log( "🦑  REDUX_ACTIONS.SET_DATA: " + action.key);
      console.log( "🐸 state[action.key]:", state[action.key] );
      console.log( "🐸 action.data:", action.data );

      // @ts-ignore
      if (!exists(state[action.key]) || !action.data) {
        return state;
      }

      // Don't proceed if nothing changed in the data.
      if (lodash.isEqual(state[action.key], action.data)) {
        console.log( "🐸 isEqual!" );
        return state;
      }

      if ( exists(state.dataChangeTracker[action.key]) ) {
        return {
          ...state,
          [action.key]: action.data,
          dataChangeTracker: {
            ...state.dataChangeTracker,
            [action.key] : state.dataChangeTracker[action.key] + 1
          }
        };
      }

      return { ...state, [action.key]: action.data };

    case REDUX_ACTIONS.START_ADVENTURE:
      let updatedMyAdventures: any = lodash.cloneDeep(state.myAdventures);
      if (action.result) {
        updatedMyAdventures.push(action.result);
      }
      return { ...state, myAdventures: updatedMyAdventures };
    case REDUX_ACTIONS.SEND_ADVENTURE_INVITATION:
      let updatedAdventureInvitations: any = lodash.cloneDeep(
        state.adventureInvitations,
      );
      if (action.result) {
        updatedAdventureInvitations.push(action.result);
      }
      return { ...state, adventureInvitations: updatedAdventureInvitations };
    case REDUX_ACTIONS.GET_ADVENTURE_STEPS: {
      let updatedAdventureSteps: any = lodash.cloneDeep(state.adventureSteps);
      updatedAdventureSteps[action.result.adventureId] =
        action.result.adventureSteps;
      return { ...state, adventureSteps: updatedAdventureSteps };
    }
    case REDUX_ACTIONS.UPDATE_ADVENTURE_STEP: {
      const adventureStepsUpdated: any = lodash.cloneDeep(state.adventureSteps);
      const newStepsArr = adventureStepsUpdated[action.update.adventureId];
      let stepToUpdate =
        newStepsArr.find(
          (step: any) => step.id === action.update.adventureStepId,
        ) || {};
      stepToUpdate = { ...stepToUpdate, ...action.update.fieldsToUpdate };
      newStepsArr[
        newStepsArr.findIndex(
          (i: any) => i.id === action.update.adventureStepId,
        )
      ] = stepToUpdate;
      adventureStepsUpdated[action.update.adventureId] = newStepsArr;
      return { ...state, adventureSteps: adventureStepsUpdated };
    }
    case REDUX_ACTIONS.UPDATE_ADVENTURE_STEP_MESSAGES:
      console.log( "UPDATE_ADVENTURE_STEP_MESSAGES" );
      let updatedAdventureStepMessages: any = lodash.cloneDeep(
        state.adventureStepMessages,
      );
      updatedAdventureStepMessages[action.result.adventureStepId] =
        action.result.adventureStepMessages;

      return {
        ...state,
        adventureStepMessages: updatedAdventureStepMessages,

        dataChangeTracker: {
          ...state.dataChangeTracker,
          adventureStepMessages : state.dataChangeTracker.adventureStepMessages + 1
        }
      };

    case REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE:
      let updatedAdventureStepMessagesAfterCreate: any = lodash.cloneDeep(
        state.adventureStepMessages,
      );
      updatedAdventureStepMessagesAfterCreate[
        action.result.adventureStepId
      ].unshift(action.result.newMessage);
      return {
        ...state,
        adventureStepMessages: updatedAdventureStepMessagesAfterCreate,
      };
    case REDUX_ACTIONS.UPDATE_VIDEO_PAGINATION:
      let newVideos: any = [];
      let videoArrToUpdate = 'allVideos';
      let paginationArrToUpdate = 'All';
      if (action.result.params.page && action.result.params.page > 1) {
        newVideos = lodash.cloneDeep(state.allVideos);

        if (action.result.params.featured) {
          newVideos = lodash.cloneDeep(state.featuredVideos);
          videoArrToUpdate = 'featuredVideos';
          paginationArrToUpdate = 'All';
        }
        if (action.result.params.popularity) {
          newVideos = lodash.cloneDeep(state.popularVideos);
          videoArrToUpdate = 'popularVideos';
          paginationArrToUpdate = 'Popular';
        }
        if (action.result.params.favorite) {
          newVideos = lodash.cloneDeep(state.favoriteVideos);
          videoArrToUpdate = 'favoriteVideos';
          paginationArrToUpdate = 'Favorite';
        }
        if (action.result.params.tag_id) {
          newVideos = lodash.cloneDeep(state.searchVideos);
          videoArrToUpdate = 'searchVideos';
          paginationArrToUpdate = 'Search';
        }
      }
      const newPagination = {
        hasMore: action.result.results._links
          ? !!action.result.results._links.next
          : false,
        page: action.result.params.page || 1,
      };
      newVideos = newVideos.concat(action.result.results.items || []);
      return {
        ...state,
        [videoArrToUpdate]: newVideos,
        videoPagination: {
          ...state.videoPagination,
          [paginationArrToUpdate]: newPagination,
        },
      };
    case REDUX_ACTIONS.UPDATE_NOTIFICATION_PAGINATION:
      let newNotifications: any = [];
      if (action.result.params.page && action.result.params.page > 1) {
        newNotifications = lodash.cloneDeep(state.notifications);
      }
      const newNotificationPagination = {
        hasMore: action.result.results._links
          ? !!action.result.results._links.next
          : false,
        page: action.result.params.page || 1,
      };
      newNotifications = newNotifications.concat(
        action.result.results.messages || [],
      );
      return {
        ...state,
        notifications: newNotifications,
        notificationPagination: newNotificationPagination,
      };
    case REDUX_ACTIONS.MARK_READ: // CONTINUE FROM HERE!!!!!!!!
      console.log( "🧑‍🚒 MARK_READ" );
      let currentBadgeCount2 = state.unReadBadgeCount;
      console.log( "🧑‍🚒 currentBadgeCount2:", currentBadgeCount2 );
      const readConversations = state.adventureStepMessages.map(c => {
        console.log( "🧑‍🚒 c:", c );
        if (c.id === action.conversationId) {
          currentBadgeCount2 =
            c.unReadCount > 0
              ? currentBadgeCount2 - c.unReadCount
              : currentBadgeCount2;
          return {
            ...c,
            hasUnread: false,
            unReadCount: 0,
            myLatestReadId: action.messageId,
          };
        }
        return c;
      });

      currentBadgeCount2 = currentBadgeCount2 >= 0 ? currentBadgeCount2 : 0;
      // Notifications.setBadge(currentBadgeCount2);
      return state;
      return {
        ...state,
        conversations: readConversations,
        unReadBadgeCount: getBadgeCount(currentBadgeCount2),
      };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    case REDUX_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}
