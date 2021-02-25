module.exports = {
  extends: ['react-native-wcandillon', 'plugin:prettier/recommended'],
  globals: {
    LOG: true,
    WARN: true,
    __DEV__: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    camelcase: 'off',
    'no-unused-vars': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    '@typescript-eslint/camelcase': [
      'error',
      {
        allow: [
          'access_token',
          'active_messengers',
          'anonymous_user_id',
          'BotImage_overlay',
          'BotImage_uke',
          'BotMessage_uke',
          'BotText_uke',
          'content_type',
          'conversation_id',
          'country_code',
          'created_at',
          'current_password',
          'device_id',
          'device_ids',
          'direct_message',
          'en_US',
          'first_name',
          'gating_period',
          'gating_start_at',
          'grant_type',
          'group_leader',
          'grouping_journey_step_id',
          'internal_step',
          'item_category',
          'item_category2',
          'item_category3',
          'item_id',
          'item_list_id',
          'item_list_name',
          'item_name',
          'item_variant',
          'journey_invite',
          'language_code',
          'last_name',
          'limit_value',
          'local_id',
          'local_version',
          'media_end',
          'media_start',
          'message_id',
          'message_reference_id',
          'messenger_answer',
          'messenger_id',
          'messenger_journey_reports',
          'messenger_journey_step_id',
          'messenger_journey_step_option_id',
          'messenger_journey_steps',
          'messenger_journeys',
          'organization_journey',
          'organization_journey_id',
          'organization_journeys',
          'page_number',
          'preview_journey_url',
          'screen_class',
          'screen_name',
          'status_message',
          'step_kind',
          'timezone_name',
          'total_count',
          'total_pages',
          'unread_messages',
          'updated_at',
          'user_data',
          'vokebot_action',
          'vokebot_conversation_id',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
