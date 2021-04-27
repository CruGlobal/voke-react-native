import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { mockUser } from 'mocks/vokeDataMocks';
import renderWithContext from 'utils/testUtils';

import ReactionPills from './index';

const initialState = {
  auth: { user: mockUser },
  data: {
    adventureSteps: {},
    adventureStepMessages: {},
  },
};

const reactionsMock = {
  '🤗': [
    '777acca2-450d-4a87-af08-599f8918abaa',
    '222acca2-450d-4a87-af08-599f8918abaa',
    '333acca2-450d-4a87-af08-599f8918abaa',
  ],
  '😄': ['777acca2-450d-4a87-af08-599f8918abaa'],
  '♥️': [
    '777acca2-450d-4a87-af08-599f8918abaa',
    '222acca2-450d-4a87-af08-599f8918abaa',
    '333acca2-450d-4a87-af08-599f8918abaa',
  ],
  '😂': ['777acca2-450d-4a87-af08-599f8918abaa'],
};

it('renders correctly', () => {
  const { queryByText, toJSON } = renderWithContext(
    <ReactionPills
      reactions={reactionsMock}
      isMyMessage={false}
      onReaction={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/♥️/i)).toBeTruthy();
  expect(queryByText(/😄/i)).toBeTruthy();
  expect(queryByText(/😂/i)).toBeTruthy();
  expect(queryByText(/🤗/i)).toBeTruthy();
  expect(queryByText(/😓/i)).not.toBeTruthy();
});

it('renders correctly my message', () => {
  const { toJSON } = renderWithContext(
    <ReactionPills
      reactions={reactionsMock}
      isMyMessage={true}
      onReaction={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('emit events correctly', () => {
  const onReaction = jest.fn();
  const { getByText } = renderWithContext(
    <ReactionPills
      reactions={reactionsMock}
      isMyMessage={false}
      onReaction={(reaction): void => {
        onReaction(reaction);
      }}
    />,
    { initialState },
  );

  fireEvent.press(getByText(/♥️/i));
  expect(onReaction).toHaveBeenCalledWith('♥️');

  fireEvent.press(getByText(/😄/i));
  expect(onReaction).toHaveBeenCalledWith('😄');

  fireEvent.press(getByText(/😂/i));
  expect(onReaction).toHaveBeenCalledWith('😂');

  fireEvent.press(getByText(/🤗/i));
  expect(onReaction).toHaveBeenCalledWith('🤗');
});

it("can't click on it's own message' reactions ", () => {
  const onReaction = jest.fn();
  const { getByText } = renderWithContext(
    <ReactionPills
      reactions={reactionsMock}
      isMyMessage={true}
      onReaction={(reaction): void => {
        onReaction(reaction);
      }}
    />,
    { initialState },
  );

  fireEvent.press(getByText(/♥️/i));
  expect(onReaction).not.toHaveBeenCalled();

  fireEvent.press(getByText(/😄/i));
  expect(onReaction).not.toHaveBeenCalled();
});
