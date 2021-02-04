import {
  TAdventureSingle,
  TStep,
  TMessage,
  TUser,
  TMessenger,
} from 'utils/types';

const avatarMock = {
  small: 'https://assets.vokeapp.com/images/user/small/avatar.jpg',
  medium: 'https://assets.vokeapp.com/images/user/medium/avatar.jpg',
  large: 'https://assets.vokeapp.com/images/user/large/avatar.jpg',
};

const adventureIconMock = {
  small:
    'https://assets.vokeapp.com/images/platform/organization/journey/small/icon_default.png',
  medium:
    'https://assets.vokeapp.com/images/platform/organization/journey/medium/icon_default.png',
  large:
    'https://assets.vokeapp.com/images/platform/organization/journey/large/icon_default.png',
};

const image = {
  small: 'https://assets.vokeapp.com/images/small/missing.png',
  medium: 'https://assets.vokeapp.com/images/medium/missing.png',
  large: 'https://assets.vokeapp.com/images/large/missing.png',
};

export const messengerMock: TMessenger = {
  id: 'messenger1',
  first_name: 'John',
  last_name: 'Doe',
  group_leader: false,
  completed: false,
  avatar: avatarMock,
  status: 'completed',
  'archived?': false,
};

const messengerBot = {
  id: '27171f1e-b73c-4ce8-ade0-17b58bdfd72b',
  first_name: 'VokeBot',
  last_name: '',
  avatar: avatarMock,
  status: 'active',
  'archived?': false,
};

export const mockUser: TUser = {
  id: 'currentUser',
  email: 'jan25@vokeapptest.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: avatarMock,
  vokebotConversationId: 'c9181540-e8c3-4a17-b36a-c8e98f2cb185',
};

export const reactionsMock = {
  '🤗': [
    'messenger1',
    '222acca2-450d-4a87-af08-599f8918abaa',
    '333acca2-450d-4a87-af08-599f8918abaa',
  ],
  '😄': ['messenger1'],
  '♥️': [
    'messenger1',
    '222acca2-450d-4a87-af08-599f8918abaa',
    '333acca2-450d-4a87-af08-599f8918abaa',
  ],
  '😂': ['messenger1'],
};

export const soloAdventureMock: TAdventureSingle = {
  id: '650b56e9-b0d2-411d-896e-ba2f9103b280',
  status: 'active',
  name: 'How Did We Get Here?',
  kind: 'solo',
  slogan: ' ',
  description:
    'Take this adventure to tour through the universe to investigate the relationship between Science and Faith',
  gating_period: null,
  gating_start_at: null,
  journey_invite: null,
  conversation: {
    id: '503109cf-ab17-4600-bab6-8be60293aedb',
    messengers: [messengerMock, messengerBot],
    unread_messages: 0,
  },
  progress: {
    total: 3,
    completed: 0,
    pending: 3,
  },
  organization_journey_id: '8c8c2dff-935c-42d5-b79f-dd76aacf970c',
  organization: {
    id: 'e211dc7b-c7fa-41eb-8cfe-157eb347a523',
    name: 'Voke Adventures (English)',
  },
  language: {
    id: 'b8349cad-c223-41e1-bf48-b21def09aca0',
    name: 'English',
  },
  item: {
    id: '69585bfc-454d-42bd-8311-d2584e88a761',
    name: 'How Did We Get Here?',
    media_start: null,
    media_end: null,
    content: {
      id: 'b8db70b1-b345-44ac-97b3-c7cf2e8953bf',
      type: 'arclight',
      url: 'http://arc.gt/7tn9w?apiSessionId=5d3e4409cbdc98.62640511',
      hls: 'http://arc.gt/uoz54?apiSessionId=5d3e4409cbdc98.62640511',
      thumbnails: {
        small:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0100-0-0.thumbnail.jpg',
        medium:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0100-0-0.mobileCinematicLow.jpg',
        large:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0100-0-0.mobileCinematicHigh.jpg',
      },
      duration: 42,
    },
  },
  image: {
    small:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/8c8/c2d/ff-/small/data.jpg?1558644384',
    medium:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/8c8/c2d/ff-/medium/data.jpg?1558644384',
    large:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/8c8/c2d/ff-/large/data.jpg?1558644384',
  },
  icon: {
    small:
      'https://assets.vokeapp.com/images/platform/organization/journey/small/icon_default.png',
    medium:
      'https://assets.vokeapp.com/images/platform/organization/journey/medium/icon_default.png',
    large:
      'https://assets.vokeapp.com/images/platform/organization/journey/large/icon_default.png',
  },
  created_at: '2021-01-28T21:45:46.761Z',
  updated_at: '2021-01-28T21:45:46.808Z',
};

export const groupAdventureMock: TAdventureSingle = {
  id: '3abf11de-773b-473f-afb9-8e3aeb258167',
  status: 'active',
  name: 'The Faith Adventure',
  kind: 'multiple',
  slogan: '',
  description:
    "What's it feel like to get the big questions of life, purpose and faith",
  gating_period: 7,
  gating_start_at: '2021-02-01T21:00:00.000Z',
  journey_invite: {
    id: 'd14f201c-3810-427f-9636-894ea63b625a',
    name: 'Jan 25 Test',
    code: '581420',
    preview_journey_url: 'https://the.vokeapp.com/Bh4iB9s',
  },
  conversation: {
    id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
    messengers: [messengerMock, messengerBot, messengerMock],
    unread_messages: 0,
  },
  progress: { total: 8, completed: 2, pending: 6 },
  organization_journey_id: 'ce620fd5-32ea-492f-81cb-d4b3e1e6cb31',
  organization: {
    id: 'e211dc7b-c7fa-41eb-8cfe-157eb347a523',
    name: 'Voke Adventures (English)',
  },
  language: {
    id: 'b8349cad-c223-41e1-bf48-b21def09aca0',
    name: 'English',
  },
  item: {
    id: '84e99385-8574-4827-8648-e1243b883092',
    name: 'The Faith Adventure',
    media_start: null,
    media_end: null,
    content: {
      id: '274517e5-4672-45a9-9e82-99236389f68f',
      type: 'arclight',
      url: 'http://arc.gt/dv8pc?apiSessionId=5f5a34950112d0.64327198',
      hls: 'http://arc.gt/qirfx?apiSessionId=5f5a34950112d0.64327198',
      thumbnails: {
        small:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.thumbnail.jpg',
        medium:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.mobileCinematicLow.jpg',
        large:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.mobileCinematicHigh.jpg',
      },
      duration: 258,
    },
  },
  image: {
    small:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/ce6/20f/d5-/small/data.jpg?1588005741',
    medium:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/ce6/20f/d5-/medium/data.jpg?1588005741',
    large:
      'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journeys/images/ce6/20f/d5-/large/data.jpg?1588005741',
  },
  icon: adventureIconMock,
  created_at: '2021-01-25T20:35:56.986Z',
  updated_at: '2021-01-26T03:36:49.091Z',
};

export const stepMock: TStep = {
  id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
  status: 'completed',
  name: 'How Did We Get Here?',
  question:
    'What does the quality of your favorite brand say about who makes it?',
  position: 1,
  kind: 'question',
  internal_step: false,
  status_message: null,
  unread_messages: 0,
  'completed_by_messenger?': true,
  image: {
    small: 'https://assets.vokeapp.com/images/small/missing.png',
    medium: 'https://assets.vokeapp.com/images/medium/missing.png',
    large: 'https://assets.vokeapp.com/images/large/missing.png',
  },
  item: {
    id: '09a91e3f-50db-4061-a7b8-a53328eeceb7',
    name: '1.1 How Did We Get Here?',
    media_start: null,
    media_end: null,
    content: {
      id: '274517e5-4672-45a9-9e82-99236389f68f',
      type: 'arclight',
      url: 'http://arc.gt/dv8pc?apiSessionId=5f5a34950112d0.64327198',
      hls: 'http://arc.gt/qirfx?apiSessionId=5f5a34950112d0.64327198',
      thumbnails: {
        small:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.thumbnail.jpg',
        medium:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.mobileCinematicLow.jpg',
        large:
          'https://d1wl257kev7hsz.cloudfront.net/cinematics/5_0-NUA0101-0-0.mobileCinematicHigh.jpg',
      },
      duration: 258,
    },
  },
  journey: {
    id: '3abf11de-773b-473f-afb9-8e3aeb258167',
    name: 'The Faith Adventure',
    slogan: '',
    conversation: {
      id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
      messengers: [messengerMock, messengerBot, messengerMock],
    },
  },
  active_messengers: [messengerMock, messengerMock],
  metadata: {
    messenger_journey_step_id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
    name: 'How Did We Get Here?',
    item_id: '09a91e3f-50db-4061-a7b8-a53328eeceb7',
    question:
      "What does the quality of your favorite brand say about who makes it? What might the beauty of our world say about it's maker?",
    comment: 'A user said I love wearing Nike.',
    step_kind: 'question',
    image: {
      small: 'https://assets.vokeapp.com/images/small/missing.png',
      medium: 'https://assets.vokeapp.com/images/medium/missing.png',
      large: 'https://assets.vokeapp.com/images/large/missing.png',
    },
  },
  locked: false,
  created_at: '2021-01-25T20:35:57.182Z',
  updated_at: '2021-01-25T20:35:57.275Z',
};

export const mockStepDecisionInactive: TStep = {
  id: 'ac21884b-6641-4a1a-b75c-a8c9dc813cb8',
  status: 'inactive',
  name: 'Decision',
  question: 'Would you like to make this commitment?',
  position: 7,
  kind: 'multi',
  internal_step: false,
  status_message: 'Answer the question to see your friends response',
  unread_messages: 1,
  'completed_by_messenger?': false,
  image: image,
  item: {
    id: '993e1571-4128-40b6-9e73-ff1fab6429a0',
    name: 'Decision',
    media_start: null,
    media_end: null,
    content: {
      id: '53f633f5-fd9c-4f1f-9f7a-a7e0572a9038',
      type: 'arclight',
      url: 'http://arc.gt/k9dx2?apiSessionId=5eb2f4a6660386.48849498',
      hls: 'http://arc.gt/21rfu?apiSessionId=5eb2f4a6660386.48849498',
      thumbnails: image,

      duration: 189,
    },
  },
  journey: {
    id: '3abf11de-773b-473f-afb9-8e3aeb258167',
    name: 'The Faith Adventure',
    slogan: '',
    conversation: {
      id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
      messengers: [messengerMock, messengerBot, messengerMock],
    },
  },
  active_messengers: [messengerMock],
  metadata: {
    messenger_journey_step_id: 'ac21884b-6641-4a1a-b75c-a8c9dc813cb8',
    name: 'Decision',
    item_id: '993e1571-4128-40b6-9e73-ff1fab6429a0',
    question: 'Would you like to make this commitment?',
    comment: '',
    step_kind: 'multi',
    image: image,
    answers: [
      {
        key: 'Yes I would',
        value: 'a0586c87-4fa3-4eec-97e2-784f7cd35897',
        selected: false,
      },
      {
        key: 'I just did',
        value: '3c5b1d09-955f-411c-a43d-d19e3fe3a2a8',
        selected: false,
      },
      {
        key: 'No thanks',
        value: '58fadb7b-66bc-41af-958a-f7c243247d83',
        selected: false,
      },
      {
        key: 'I already have',
        value: 'f0dd0b8e-ce7c-427c-9d18-406cdbfac713',
        selected: false,
      },
      {
        key: "I'm not sure ",
        value: '03f4599c-ddcf-46a6-a17e-d5f66cc733d3',
        selected: false,
      },
    ],
  },
  locked: false,
  created_at: '2021-01-25T20:35:57.197Z',
};

export const mockMessage: TMessage = {
  id: 'd64a1b4e-3214-4c31-b46a-24ca9e946ab2',
  content: 'Test message content',
  position: 2,
  messenger_id: 'messenger2',
  conversation_id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
  messenger_journey_step_id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
  grouping_journey_step_id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
  kind: 'text',
  direct_message: false,
  item: null,
  reactions: {
    '🤗': [
      'messenger1',
      '222acca2-450d-4a87-af08-599f8918abaa',
      '333acca2-450d-4a87-af08-599f8918abaa',
    ],
    '😄': ['messenger1'],
    '♥️': [
      'messenger1',
      '222acca2-450d-4a87-af08-599f8918abaa',
      '333acca2-450d-4a87-af08-599f8918abaa',
    ],
    '😂': ['messenger1'],
  },
  'adventure_message?': true,
  metadata: {},
  created_at: '2021-01-25T20:44:00.960Z',
};

export const mockMyMessage: TMessage = {
  id: 'd64a1b4e-3214-4c31-b46a-24ca9e946ab2',
  content: 'Test message content',
  position: 2,
  messenger_id: 'currentUser',
  conversation_id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
  messenger_journey_step_id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
  grouping_journey_step_id: 'aad54470-cb18-4e95-b626-171d9fb500ee',
  kind: 'text',
  direct_message: false,
  item: null,
  reactions: {
    '🤗': [
      'messenger2',
      '222acca2-450d-4a87-af08-599f8918abaa',
      '333acca2-450d-4a87-af08-599f8918abaa',
    ],
    '😄': ['messenger1'],
    '♥️': [
      'messenger2',
      '222acca2-450d-4a87-af08-599f8918abaa',
      '333acca2-450d-4a87-af08-599f8918abaa',
    ],
    '😂': ['messenger2'],
  },
  'adventure_message?': true,
  metadata: {},
  created_at: '2021-01-25T20:44:00.960Z',
};

export const botMessageMock: TMessage = {
  id: '2021-01-28T21:45:50.991Z',
  messenger_id: '27171f1e-b73c-4ce8-ade0-17b58bdfd72b',
  content:
    "A user said I've thought about this on and off over the years without any conclusion.",
  metadata: {
    vokebot_action: 'journey_step_comment',
    grouping_journey_step_id: '1a15a80c-3168-492d-85c4-87d7b93fb337',
  },
  created_at: '2021-01-25T20:44:00.960Z',
};

const decisionOptionsDefault = [
  {
    key: 'Not yet',
    value: '26cbf173-bb2f-4ccf-b3c9-11ed98733790',
    selected: false,
  },
  {
    key: 'I just did',
    value: 'fa9bd7f8-4016-4c10-b7ec-70871f74bcc6',
    selected: false,
  },
];

const decisionOptionsSelected = [
  {
    key: 'Not yet',
    value: '26cbf173-bb2f-4ccf-b3c9-11ed98733790',
    selected: true,
  },
  {
    key: 'I just did',
    value: 'fa9bd7f8-4016-4c10-b7ec-70871f74bcc6',
    selected: false,
  },
];

export const mockMessageBinaryDefault: TMessage = {
  id: '286eb8cc-fbd9-4b46-bce0-4b569d7bfa27',
  content: '',
  position: 2,
  messenger_id: '27171f1e-b73c-4ce8-ade0-17b58bdfd72b',
  conversation_id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
  messenger_journey_step_id: '1693da4d-a8bd-40e3-99fd-913a1c8df372',
  grouping_journey_step_id: 'ac21884b-6641-4a1a-b75c-a8c9dc813cb8',
  kind: 'text',
  direct_message: true,
  item: null,
  reactions: {},

  'adventure_message?': true,
  metadata: {
    messenger_journey_step_id: '1693da4d-a8bd-40e3-99fd-913a1c8df372',
    name: 'PRAYER',
    question: 'Have you made this commitment today?',
    comment:
      'Jesus, thank you for loving me, thank you for the worth you speak into',
    step_kind: 'binary',
    image: {
      small:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/small/data.jpg?1581968878',
      medium:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/medium/data.jpg?1581968878',
      large:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/large/data.jpg?1581968878',
    },
    answers: decisionOptionsDefault,
    vokebot_action: 'journey_step',
  },

  created_at: '2021-01-29T05:59:38.542Z',
};

export const mockMessageBinarySelected: TMessage = {
  id: '286eb8cc-fbd9-4b46-bce0-4b569d7bfa27',
  content: '',
  position: 2,
  messenger_id: '27171f1e-b73c-4ce8-ade0-17b58bdfd72b',
  conversation_id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
  messenger_journey_step_id: '1693da4d-a8bd-40e3-99fd-913a1c8df372',
  grouping_journey_step_id: 'ac21884b-6641-4a1a-b75c-a8c9dc813cb8',
  kind: 'text',
  direct_message: true,
  item: null,
  reactions: {},

  'adventure_message?': true,
  metadata: {
    messenger_journey_step_id: '1693da4d-a8bd-40e3-99fd-913a1c8df372',
    name: 'PRAYER',
    question: 'Have you made this commitment today?',
    comment:
      'Jesus, thank you for loving me, thank you for the worth you speak into',
    step_kind: 'binary',
    image: {
      small:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/small/data.jpg?1581968878',
      medium:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/medium/data.jpg?1581968878',
      large:
        'https://cru-vokeapi-prod.s3.amazonaws.com/platform/organization/journey/steps/images/811/1ed/6d-/large/data.jpg?1581968878',
    },
    answers: decisionOptionsSelected,
    vokebot_action: 'journey_step',
  },

  created_at: '2021-01-29T05:59:38.542Z',
};
