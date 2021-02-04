import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import Reactions from '../index';

it('renders correctly', () => {
  const { queryByText, toJSON } = render(
    <Reactions
      onReaction={(): void => {
        // void.
      }}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/♥️/i)).toBeTruthy();
  expect(queryByText(/😄/i)).toBeTruthy();
  expect(queryByText(/😂/i)).toBeTruthy();
  expect(queryByText(/🤗/i)).toBeTruthy();
  expect(queryByText(/😓/i)).toBeTruthy();
});

it('emit events correctly', () => {
  const onReaction = jest.fn();
  const { getByTestId } = render(
    <Reactions
      onReaction={(reaction): void => {
        onReaction(reaction);
      }}
    />,
  );

  fireEvent(getByTestId('reaction-0'), 'onPressIn');
  expect(onReaction).toHaveBeenCalledWith('♥️');

  fireEvent(getByTestId('reaction-1'), 'onPressIn');
  expect(onReaction).toHaveBeenCalledWith('😄');

  fireEvent(getByTestId('reaction-2'), 'onPressIn');
  expect(onReaction).toHaveBeenCalledWith('😂');

  fireEvent(getByTestId('reaction-3'), 'onPressIn');
  expect(onReaction).toHaveBeenCalledWith('🤗');

  fireEvent(getByTestId('reaction-4'), 'onPressIn');
  expect(onReaction).toHaveBeenCalledWith('😓');
});
