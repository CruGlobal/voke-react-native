/* eslint-disable camelcase */
/* Global Types to be reused inside the components */
// import type { TAdventure } from "./types.ts";
// export type { SomeThing };

import { ScrollView } from 'react-native';

// Types for React Navigation router:
// https://reactnavigation.org/docs/typescript/
export type AdventureStackParamList = {
  Adventures: undefined;
  AdventureAvailable: {
    item: TAvailableAdventure;
    alreadyStartedByMe: boolean;
  };
  AdventureActive: {
    adventureId: string;
  };
  AdventureManage: {
    adventureId: string;
  };
  AdventureStepScreen: {
    stepId: string;
    adventureId: string;
  };
  GroupModal: {
    adventureId: string;
  };
  AllMembersModal: {
    adventureId: string;
    isJoined: boolean;
  };
  AccountPhoto:
    | {
        onComplete: () => {};
      }
    | undefined;
  // ExampleRouteName: { sort: 'latest' | 'top' } | undefined;
};

export type VideoStackParamList = {
  Explore: undefined;
  VideoDetails: {
    item: TVideoItem;
  };
};

export type NotificationStackParamList = {
  Notifications: undefined;
};

export type RootStackParamList = {
  LoggedInApp: undefined;
  Welcome: undefined;
  AccountName:
    | {
        onComplete: () => {};
      }
    | undefined;
  AdventureCode: undefined;
  AccountPhoto: undefined;
  Menu: undefined;
  AccountCreate: {
    layout?: 'embed';
    parentScroll?: React.RefObject<ScrollView>;
    scrollTo?: number;
    onComplete?: () => void;
  };
  AccountSignIn: {
    layout?: 'embed';
    parentScroll?: React.RefObject<ScrollView>;
    scrollTo?: number;
    onComplete?: () => void;
  };
  ForgotPassword: undefined;
  AccountProfile: undefined;
  SignUp: undefined;
  AccountEmail: undefined;
  AccountPass: undefined;
  Help: undefined;
  About: undefined;
  Acknowledgements: undefined;
};

export type AppStackParamList = {
  Root: undefined;
  AdventureName: undefined;
  GroupReleaseType: undefined;
  GroupReleaseDate: undefined;
  AdventureShareCode: {
    invitation: TInvitation;
    withGroup: boolean;
    isVideoInvite: boolean;
    onClose?: () => void; // When "Done" button clicked.
  };
  KitchenSink: undefined;
};

type TVideoItem = {
  id: string;
  name: string;
  media_start: number | null;
  media_end: number | null;
  content: {
    id: string;
    type: string;
    url: string;
    hls?: string;
    duration: number;
    thumbnails: {
      small: string;
      medium: string;
      large: string;
    };
  };
};

type TImage = {
  small: string;
  medium: string;
  large: string;
};

export interface TMessenger {
  id: string;
  first_name: string;
  last_name: string;
  group_leader?: boolean;
  completed?: boolean;
  'archived?'?: boolean;
  avatar: TImage;
  status?: string; //"active"
}

export interface TUser {
  id: string;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  avatar?: TImage | undefined;
  vokebotConversationId?: string;
}

export type TStep = {
  // https://github.com/CruGlobal/voke_api/blob/3d4b8d84828318a4b3334e45986cb69579cd62d0/spec/acceptance/api/messenger/v1/me/journeys/steps_spec.rb#L86
  // https://github.com/CruGlobal/voke_api/blob/8818b3d3711c5dd43a39e0f193cd5b2a78a1ff9f/spec/models/platform/organization/journey/step_spec.rb#L55
  id: string;
  status: 'locked' | 'inactive' | 'active' | 'completed';
  name: string;
  question: string;
  position: number;
  kind: 'regular' | 'share' | 'text' | 'multi' | 'binary' | 'question';
  internal_step: boolean; // NOT USED. if a step is internal or not (it is a main step)
  status_message: string | null; // Message to be displayed as the top VokeBot banner in the single step view.
  unread_messages: number;
  'completed_by_messenger?': boolean;
  image: TImage;
  item: {
    id: string;
    name: string;
    media_start: string | null;
    media_end: string | null;
    content: {
      id: string;
      type: 'arclight' | 'youtube';
      url: string;
      hls: string;
      thumbnails: TImage;
      duration: number;
    };
  };
  journey: {
    id: string;
    name: string;
    slogan: string;
    conversation: {
      id: string;

      messengers: TMessenger[];
    };
  };
  active_messengers: TMessenger[];
  //  metadata.answers
  metadata?: {
    messenger_journey_step_id?: string;
    name?: string;
    item_id?: string;
    question?: string;
    comment?: string;
    step_kind?: 'regular' | 'share' | 'text' | 'multi' | 'binary' | 'question';
    image?: TImage;
    answers?: TAnswer[];
  };
  locked: boolean;
  created_at: string;
  updated_at?: string;
};

// Typing for myAdventures.
export type TAdventureSteps = TStep[];

export type TAnswer = {
  key?: string;
  value: string;
  selected?: boolean;
};

// Typing for single Adventure from availableAdventure.
export type TAvailableAdventure = {
  id: string;
  name: string;
  slogan: string;
  description: string;
  total_steps: number;
  total_shares: number;
  organization: {
    id: string;
    name: string;
  };
  language: {
    id: string;
    name: string;
  };
  item: TVideoItem;
  image: TImage;
  icon: TImage;
  created_at: string;
  updated_at: string;
};

// Typing for single Adventure from myAdventures.
export type TAdventureSingle = {
  id: string;
  status: 'active' | 'completed' | 'canceled';
  kind: 'duo' | 'solo' | 'multiple';
  name: string;
  slogan: string;
  description: string;
  gating_period: number | null;
  gating_start_at: string | null;
  journey_invite: {
    id: string;
    name: string;
    code: string;
    preview_journey_url?: string;
  } | null;
  conversation: {
    id: string;
    messengers: TMessenger[];
    unread_messages: number;
  };
  progress: {
    total: number;
    completed: number;
    pending: number;
  };
  organization_journey_id: string;
  organization: {
    id: string;
    name: string;
  };
  language: {
    id: string;
    name: string;
  };
  // Video Trailer:
  item: TVideoItem;
  image: TImage;
  icon: TImage;
  created_at: string;
  updated_at: string;
};

// Typing for myAdventures.
export type TAdventures = TAdventureSingle[];

// Typing for single Message from myAdventures.
export type TMessage = {
  id: string;
  content: string;
  position?: number;
  messenger_id?: string;
  messenger_answer?: string;
  conversation_id: string;
  messenger_journey_step_id?: string;
  grouping_journey_step_id?: string;
  kind?: 'text' | 'request' | 'response' | 'question' | 'answer' | 'request_information';
  direct_message?: boolean;
  'adventure_message?'?: boolean;
  selected?: boolean; // Selected option in multichoise option.
  metadata?: {
    created_at?: string;
    step_kind?: TStep['kind'];
    answers?: TAnswer[];
    question?: string;
    vokebot_action?: string;
    grouping_journey_step_id?: string;
    messenger_journey_step_id?: string;
    messenger_answer?: string;
    name?: string;
    comment?: string;
    image?: TImage;
  };
  item?: {
    id: string;
    name: string;
    description: string;
    content: string;
    content_type: string;
    media: {
      id: string;
      url: string;
      type: string;
      thumbnails: TImage;
      duration: number;
    };
    media_start?: number;
    media_end?: number;
  } | null;
  created_at: string;
  reactions?: {
    [emoji: string]: string[];
  };
};

export interface TInvitation {
  id: string;
  messenger_journey_id: string;
  code: string;
  name: string;
  kind: 'duo' | 'multiple';
  status: 'waiting' | 'canceled' | 'accepted';
  preview_journey_url: string;
  organization_journey: {
    id: string;
    name: string;
    slogan: string;
    image: TImage;
  };
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface TDataState {
  dataChangeTracker: {
    notifications: number;
    myAdventures: number;
    adventureInvitations: number;
    availableAdventures: number;
    adventureSteps: number;
    adventureStepMessages: number;
    allVideos: number;
    featuredVideos: number;
    favoriteVideos: number;
  };
  notifications: object[];
  notificationPagination: { hasMore: boolean; page: number };
  notificationUnreadBadge: number;
  unReadBadgeCount: number;
  availableAdventures: TAvailableAdventure[];
  myAdventures: {
    byId: { [key: string]: TAdventureSingle } | {};
    allIds: (string | null)[];
  };
  adventureInvitations: {
    byId: { [key: string]: TInvitation } | {};
    allIds: (string | null)[];
  };
  adventureSteps: {
    [key: string]: {
      byId: { [key: string]: object } | {};
      allIds: (string | null)[];
    };
  };
  adventureStepMessages: { [key: string]: TMessage[] };
  allVideos: { byId: { [key: string]: object } | {}; allIds: [string] | [] };
  featuredVideos: {
    byId: { [key: string]: object } | {};
    allIds: (string | null)[];
  };
  popularVideos: {
    byId: { [key: string]: object } | {};
    allIds: (string | null)[];
  };
  favoriteVideos: {
    byId: { [key: string]: object } | {};
    allIds: (string | null)[];
  };
  searchVideos: {
    byId: { [key: string]: object } | {};
    allIds: (string | null)[];
  };
  videoTags: [];
  videoPagination: { [key: string]: object } | {};
}

// Error object we often get back from the Voke API.
export type TError = {
  error: string;
};
