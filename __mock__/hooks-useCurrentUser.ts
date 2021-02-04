import { mockUser } from 'mocks/vokeDataMocks';

jest.mock('hooks/useCurrentUser', () => {
  return jest.fn(() => mockUser);
});
