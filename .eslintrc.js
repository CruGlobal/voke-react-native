module.exports = {
  extends: ['react-native-wcandillon', 'plugin:prettier/recommended'],
  globals: {
    LOG: true,
    WARN: true,
    __DEV__: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
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
    camelcase: [
      'error',
      {
        allow: [
          'message_id',
          'messenger_id',
          'messenger_answer',
          'messenger_journeys',
          'messenger_journey_reports',
          'messenger_journey_steps',
          'messenger_journey_step_id',
          'step_kind',
          'vokebot_action',
          'organization_journeys',
          'page_number',
          'total_pages',
          'total_count',
          'limit_value',
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
