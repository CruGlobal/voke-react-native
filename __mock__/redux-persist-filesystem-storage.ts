jest.mock('redux-persist-filesystem-storage', () => {
  return {
    getItem: () => { },
  }
});
