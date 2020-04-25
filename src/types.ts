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

type TMessenger = {
  id: string;
  first_name: string;
  last_name: string;
  group_leader?: boolean;
  avatar: TImage;
};

// Typing for single Adventure from myAdventures.
export type TAdventureSingle = {
  id: string;
  status: 'active' | 'completed';
  kind: 'duo' | 'solo' | 'multiple';
  name: string;
  slogan: string;
  description: string;
  journey_invite: {
    id: string;
    name: string;
    code: string;
  };
  conversation: {
    id: string;
    unread_messages: number;
    messengers: TMessenger[];
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
    answers: any;
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
