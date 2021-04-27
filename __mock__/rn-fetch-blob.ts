jest.mock('rn-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
  };
});

jest.mock('actions/auth', () => ({
  checkCurrentLanguage: () => {
    return {};
  },
}));
