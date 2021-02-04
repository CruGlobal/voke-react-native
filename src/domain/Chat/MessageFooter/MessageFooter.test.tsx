import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { reactionsMock } from 'mocks/vokeDataMocks';

import MessageFooter from './index';

it('renders correctly', () => {
  const { queryByText, toJSON } = render(
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={false}
      reactions={reactionsMock}
      onReaction={(): void => {
        // void
      }}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/♥️/i)).toBeTruthy();
  expect(queryByText(/😄/i)).toBeTruthy();
  expect(queryByText(/😂/i)).toBeTruthy();
  expect(queryByText(/🤗/i)).toBeTruthy();
  expect(queryByText(/😓/i)).not.toBeTruthy();
});

it('renders correctly my message', () => {
  const { toJSON } = render(
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={true}
      reactions={reactionsMock}
      onReaction={(): void => {
        // void
      }}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
});

it('emit events correctly', () => {
  const onReaction = jest.fn();
  const { getByText } = render(
    <MessageFooter
      date={'2021-01-25T20:44:00.960Z'}
      isMyMessage={false}
      reactions={reactionsMock}
      onReaction={(reaction): void => {
        onReaction(reaction);
      }}
    />,
  );

  fireEvent.press(getByText(/♥️/i));
  expect(onReaction).toHaveBeenCalledWith('♥️');
});
