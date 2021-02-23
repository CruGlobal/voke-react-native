jest.mock('rn-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
  };
});
