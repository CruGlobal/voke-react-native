import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { mockUser, reactionsMock } from 'mocks/vokeDataMocks';
import renderWithContext from 'utils/testUtils';

import MessageFooter from './index';

const initialState = {
  auth: { user: mockUser },
  data: {
    adventureSteps: {},
    adventureStepMessages: {},
  },
};

it('renders correctly', () => {
  const { queryByText, toJSON } = renderWithContext(
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={false}
      reactions={reactionsMock}
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
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={true}
      reactions={reactionsMock}
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
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={false}
      reactions={reactionsMock}
      onReaction={(reaction): void => {
        onReaction(reaction);
      }}
    />,
    { initialState },
  );

  fireEvent.press(getByText(/♥️/i));
  expect(onReaction).toHaveBeenCalledWith('♥️');
});
