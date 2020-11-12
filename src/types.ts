/* eslint-disable camelcase */
/* Global Types to be reused inside the components */
// import type { TAdventure } from "./types.ts";
// export type { SomeThing };

type TVideoItem = {
  id: string;
  name: string;
  media_start: number;
  media_end: number;
  content: {
    id: string;
    type: string;
    url: string;
    hsl?: string;
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
  avatar: TImage;
};

export interface TUser {
  id: string;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  avatar?: TImage | undefined;
}

export type TStep = {
  id: string;
  name: string;
  position: number;
  status: string;
  locked: boolean;
  item: {
    content: {
      thumbnails: TImage;
    };
  };
  active_messengers: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: TImage;
  }[];
  // eslint-disable-next-line camelcase
  unread_messages: number;
  'completed_by_messenger?': boolean;
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
  gating_period: number;
  gating_start_at: string;
  journey_invite: {
    id: string;
    name: string;
    code: string;
  };
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

// Typing for single Step from adventureSteps.
export type TAdventureStepSingle = {
  id: string;
  status: 'active' | 'completed';
  name: string;
  question: string;
  position: number;
  kind: 'question' | 'answer' | 'binary' | 'multi' | 'share';
  internal_step: boolean;
  status_message: string;
  unread_messages: number;
  'completed_by_messenger?': boolean;
  image: TImage;
  item: TVideoItem;
  journey: {
    id: string;
    name: string;
    slogan: string;
    conversation: {
      id: string;
      messengers: TMessenger[];
    };
  };
  metadata: {
    messenger_journey_step_id: string;
    name: string;
    item_id: string;
    question: string;
    comment: string;
    step_kind: 'question' | 'answer' | 'binary' | 'multi' | 'share';
    image: TImage;
  };
  created_at: string;
  updated_at: string;
};

// Typing for myAdventures.
export type TAdventureSteps = TAdventureStepSingle[];

// Typing for single Message from myAdventures.
export type TMessage = {
  id: string;
  content: string;
  position: number;
  messenger_id: string;
  messenger_answer: string;
  conversation_id: string;
  messenger_journey_step_id: string;
  kind: 'text' | 'request' | 'response';
  direct_message: boolean;
  'adventure_message?': boolean;
  metadata?: {
    created_at: string;
    step_kind: string;
    answers: {
      key: string;
      value: number;
    }[];
    question: string;
    vokebot_action: string;
    messenger_journey_step_id: string;
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
    media_start: number;
    media_end: number;
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
  }
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
  adventureStepMessages: { [key: string]: object } | {};
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
  searchVideos: { byId: { [key: string]: object } | {}; allIds: (string | null)[] };
  videoTags: [];
  videoPagination: { [key: string]: object } | {};
}
