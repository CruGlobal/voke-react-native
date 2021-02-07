jest.mock('@react-native-community/clipboard', () => ({
  setString: jest.fn(),
}));
