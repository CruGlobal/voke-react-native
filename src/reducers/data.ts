import { REDUX_ACTIONS } from '../constants';
import { normalize, schema } from 'normalizr';
import lodash from 'lodash';
import { exists } from '../utils';
import { TDataState } from '../types';

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



const initialState: TDataState = {
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
  myAdventures: {
    byId: {},
    allIds: []
  },
  adventureInvitations: {
    byId: {},
    allIds: []
  },
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
    case REDUX_ACTIONS.SET_DATA: {
      // @ts-ignore
      if (!exists(state[action.key]) || !action.data) {
        return state;
      }

      // Don't proceed if nothing changed in the data.
      if (lodash.isEqual(state[action.key], action.data)) {
        return state;
      }
/*
      if ( exists(state.dataChangeTracker[action.key]) ) {
        return {
          ...state,
          [action.key]: action.data,
          dataChangeTracker: {
            ...state.dataChangeTracker,
            [action.key] : state.dataChangeTracker[action.key] + 1
          }
        };
      } */

      return { ...state, [action.key]: action.data };
    }

    case REDUX_ACTIONS.START_ADVENTURE: {
      let updatedMyAdventures: any = lodash.cloneDeep(state.myAdventures);
      if (action.result) {
        updatedMyAdventures.push(action.result);
      }
      return { ...state, myAdventures: updatedMyAdventures };
    }

    case REDUX_ACTIONS.SEND_ADVENTURE_INVITATION: {

      const allIds = state.adventureInvitations.allIds||[];

      return {
        ...state,
        adventureInvitations: {
          byId: {
            ...state.adventureInvitations.byId,
            [action.result.id]: action.result
          },
          allIds: allIds.concat([action.result.id]),
        }
      };
    }

    case REDUX_ACTIONS.UPDATE_INVITATIONS: {
      // See 'UPDATE_INVITATIONS NORMALIZATION EXAMPLE' at the end of this file.
      const invitationSchema = new schema.Entity('byId');
      const invitationsSchema = new schema.Array(invitationSchema);
      const normalizedInvitations = normalize( // Result.
        action.data, // Data received.
        invitationsSchema // Transformation schema.
      );

      // Since we are getting all invitations at once,
      // we relace all of them in the storage, not updating.
      return {
        ...state,
        adventureInvitations: {
          byId: normalizedInvitations.entities.byId,
          allIds: normalizedInvitations.result,
        },
        // Change tracker value to signal deep data change.
        /* 
        dataChangeTracker: {
          ...state.dataChangeTracker,
          adventureInvitations: state.dataChangeTracker.adventureInvitations + 1
        } */
      };
    }

    case REDUX_ACTIONS.UPDATE_ADVENTURES: {
      // See 'UPDATE_ADVENTURES NORMALIZATION EXAMPLE' at the end of this file.
      const adventureSchema = new schema.Entity('byId');
      const adventuresSchema = new schema.Array(adventureSchema);
      const normalizedAdventures = normalize( // Result.
        action.data, // Data received.
        adventuresSchema // Transformation schema.
      );

      return {
        ...state,
        myAdventures: {
          byId: normalizedAdventures.entities.byId || {},
          allIds: normalizedAdventures.result,
        },
        // Change tracker value to signal deep data change.
        /* 
        dataChangeTracker: {
          ...state.dataChangeTracker,
          myAdventures: state.dataChangeTracker.myAdventures + 1
        } */
      };
    }

    case REDUX_ACTIONS.UPDATE_ADVENTURE: {
      return {
        ...state,
        myAdventures: {
          ...state.myAdventures,
          byId: {
            ...state.myAdventures.byId,
            [action.data.id]: action.data
          },
        },
        // Change tracker value to signal deep data change.
        /* 
        dataChangeTracker: {
          ...state.dataChangeTracker,
          myAdventures: state.dataChangeTracker.myAdventures + 1
        } */
      };
    }

    case REDUX_ACTIONS.UPDATE_UNREAD_TOTAL: {
      return {
        ...state,
        unReadBadgeCount: action.data
      };
    }

    case REDUX_ACTIONS.UPDATE_ADVENTURE_STEPS: {
      /*
      Adventure steps received:
      {
        id:"7290f105-ac6b-40df-ad41-47a5501e91b1"
        status:"completed"
        name:"Was Jesus the Real Deal?"
        question:"Does it surprise you to hear that more ancient documents help us verify Jesus' existence than other well known figures such as Alexander the Great or Julius Caesar?"
        position:1
        kind:"question"
        internal_step:false
        status_message:null
        unread_messages:1
        completed_by_messenger?:true
        created_at:"2020-05-06T19:12:45.218Z"
        updated_at:"2020-05-06T19:13:52.392Z"
      },
      {
        ..
      }

      will normalize into:
        byId: {
          "7290f105-ac6b-40df-ad41-47a5501e91b1" : {
            ...
          },
          ...,
          ...
        },
        allIds: ["7290f105-ac6b-40df-ad41-47a5501e91b1", ..., ...]

      */
      // Don't proceed if nothing changed in the data.
/*       if (lodash.isEqual(
        state.adventureSteps[action.result.adventureId],
        action.result.adventureSteps
      )) {
        return state;
      }
 */
      const stepSchema = new schema.Entity('byId');
      const stepsSchema = new schema.Array(stepSchema);
      const normalizedSteps = normalize( // Result.
        action.result.adventureSteps, // Data received.
        stepsSchema // Transformation schema.
      );

      // Calculate new unread count for the affected adventure card.
      const adventureId = action.result.adventureId;

      let advUnreadCount = 0;
      action.result.adventureSteps.forEach(advStep => {
        advUnreadCount = advUnreadCount + advStep.unread_messages;
      });

      // return state;

      // CONTINUE FROM HERE!!!!
      return {
        ...state,

        // Update Adventure Steps.
        adventureSteps: {
          ...state.adventureSteps,

          [adventureId]: {
            byId: normalizedSteps.entities.byId,
            allIds: normalizedSteps.result,
          }
        },

        // Update MyAdventures with new 'unread' value for current adventure.
        myAdventures: {
          ...state.myAdventures,
          byId:{
            ...state.myAdventures.byId,
            [adventureId]: {
              ...state.myAdventures.byId[adventureId],
              conversation:{
                ...state.myAdventures.byId[adventureId].conversation,
                unread_messages: advUnreadCount
              }
            }

          }
        },

        // Change tracker value to signal deep data change.
        /* 
        dataChangeTracker: {
          ...state.dataChangeTracker,
          adventureSteps: state.dataChangeTracker.adventureSteps + 1,
          myAdventures: state.dataChangeTracker.myAdventures + 1
        } */
      };
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

    case REDUX_ACTIONS.UPDATE_ADVENTURE_STEP_MESSAGES: {
      // Flip messages as they come reversed:
      const newMessages = action.result.adventureStepMessages.reverse();
      const adventureStepId = action.result.adventureStepId;
      console.log( "🐙 adventureStepId:", adventureStepId );
      return {
        ...state,
        adventureStepMessages: {
          ...state.adventureStepMessages,
          [adventureStepId]: newMessages
        },

        // dataChangeTracker: {
        //   ...state.dataChangeTracker,
        //   adventureStepMessages : state.dataChangeTracker.adventureStepMessages + 1
        // }
      };
    }

    case REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE: {
      const adventureStepId = action.result.adventureStepId

      return {
        ...state,
        adventureStepMessages: {
          ...state.adventureStepMessages,
          [adventureStepId]: [
            ...state.adventureStepMessages[adventureStepId] || [], // Existing messages.
            action.result.newMessage // New message.
          ]
        }
      };
    }
    case REDUX_ACTIONS.UPDATE_VIDEO_PAGINATION: {
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
    }
    case REDUX_ACTIONS.UPDATE_NOTIFICATION_PAGINATION: {
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
    }
    case REDUX_ACTIONS.MARK_READ: {
      // PARAMS: adventureId, conversationId, messageId
      // Set state.adventureSteps[adventureId][currentStepId].unread_messages = 0
      // state.adventureSteps[adventureId]
      const adventureId = action.adventureId;
      const stepId = action.stepId;

      return {
        ...state,
        // Set 'unread_messages' to 0 at current adventure step.
        adventureSteps: {
          ...state.adventureSteps,
          [adventureId]: {
            ...state.adventureSteps[adventureId],
            byId:{
              ...state.adventureSteps[adventureId].byId,
              [stepId]:{
                ...state.adventureSteps[adventureId].byId[stepId],
                unread_messages: 0
              }
            }
          }
        },
      };
    }
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    case REDUX_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

/*
  ============================================================
  UPDATE_ADVENTURES NORMALIZATION EXAMPLE.

  Adventures received:
  {
    id:"00a2262d-99cd-4d54-b5ba-d7032b25d640"
    status:"active"
    name:"Is Jesus Real?"
    kind:"duo"
    slogan:""
    description:"Take this adventure to journey..."
    organization_journey_id:"778e3d9b-8bb9-4a7f-94bb-41a7c8942681"
    created_at:"2020-05-06T19:12:45.071Z"
    updated_at:"2020-05-06T19:26:37.662Z"
  },
  {
    ..
  }

  Will normalize into:
  {
    byId: {
      "00a2262d-99cd-4d54-b5ba-d7032b25d640" : {
        ...
      },
      ...,
    },
    allIds: ["00a2262d-99cd-4d54-b5ba-d7032b25d640", ..., ...]
  }

  ============================================================
  UPDATE_INVITATIONS NORMALIZATION EXAMPLE.

  Invitations received:
  {
    id:"7af395ad-2a75-4893-ba19-71f5931f70d1"
    messenger_journey_id:"ec833567-0e84-46e3-8a09-0c1d7cbf5820"
    code:"927422"
    name:"Irina"
    kind:"duo"
    status:"waiting"
    expires_at:"2020-05-07T05:50:27.104Z"
    created_at:"2020-05-06T21:50:27.104Z"
    updated_at:"2020-05-06T21:50:27.112Z"
  },
  {
    ...
  }

  Will normalize into:
  {
    byId: {
      "7af395ad-2a75-4893-ba19-71f5931f70d1" : {
        ...
      },
      ...,
      ...
    },
    allIds: ["7af395ad-2a75-4893-ba19-71f5931f70d1", ..., ...]
  }

*/
