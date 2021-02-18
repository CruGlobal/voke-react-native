import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Host } from 'react-native-portalize';
import '@testing-library/jest-native';
import { messengerMock, mockMessage, mockUser } from 'mocks/vokeDataMocks';

import TextMessage from './index';

it('renders correctly', () => {
  const { queryByText, toJSON } = render(
    <TextMessage
      user={mockUser}
      message={mockMessage}
      messenger={messengerMock}
      isBlured={false}
      isSharedAnswer={false}
      canReport={true}
      onReport={(): void => {
        // void.
      }}
      onCopy={(): void => {
        // void.
      }}
      onReaction={(): void => {
        // void.
      }}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/John Doe/i)).toBeTruthy();
  expect(queryByText(/Test message content/i)).toBeTruthy();
  expect(queryByText(/Jan 25/i)).toBeTruthy();
  expect(queryByText(/Report/i)).not.toBeTruthy();
  expect(queryByText(/Copy/i)).not.toBeTruthy();
});

it('context mode renders correctly', () => {
  const { queryByText, queryByTestId, getByTestId, toJSON } = render(
    <Host>
      <TextMessage
        user={mockUser}
        message={mockMessage}
        messenger={messengerMock}
        isBlured={false}
        isSharedAnswer={false}
        canReport={true}
        onReport={(): void => {
          // void.
        }}
        onCopy={(): void => {
          // void.
        }}
        onReaction={(): void => {
          // void.
        }}
      />
    </Host>,
  );
  // Activate message context mode.
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  // Do all the checks.
  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/John Doe/i)).toBeTruthy();
  expect(queryByText(/Test message content/i)).toBeTruthy();
  expect(queryByText(/Jan 25/i)).toBeTruthy();
  expect(queryByTestId('reactionsPopup')).toBeTruthy();
  expect(queryByText(/Report/i)).toBeTruthy();
  expect(queryByText(/Copy/i)).toBeTruthy();
});

it('reactions calculated correctly', () => {
  const { queryByText } = render(
    <TextMessage
      user={mockUser}
      message={mockMessage}
      messenger={messengerMock}
      isBlured={false}
      isSharedAnswer={false}
      canReport={true}
      onReport={(): void => {
        // void.
      }}
      onCopy={(): void => {
        // void.
      }}
      onReaction={(): void => {
        // void.
      }}
    />,
  );

  expect(queryByText(/🤗 3/i)).toBeTruthy();
  expect(queryByText(/😄 1/i)).toBeTruthy();
  expect(queryByText(/♥️ 3/i)).toBeTruthy();
  expect(queryByText(/😂 1/i)).toBeTruthy();
});

it('emit events correctly', () => {
  const onReport = jest.fn();
  const onCopy = jest.fn();
  const onReaction = jest.fn();
  const { queryByTestId, getByTestId } = render(
    <Host>
      <TextMessage
        user={mockUser}
        message={mockMessage}
        messenger={messengerMock}
        isBlured={false}
        isSharedAnswer={false}
        canReport={true}
        onReport={onReport}
        onCopy={onCopy}
        onReaction={(newReaction): void => {
          onReaction(newReaction);
        }}
      />
    </Host>,
  );
  // Activate context mode.
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  expect(queryByTestId('reactionsPopup')).toBeTruthy();

  fireEvent(getByTestId('reaction-1'), 'onPressIn');
  expect(onReaction).toHaveBeenCalled();
  expect(queryByTestId('reactionsPopup')).not.toBeTruthy(); // Context mode close.

  fireEvent.press(getByTestId('reactionPill-1'));
  expect(onReaction).toHaveBeenCalled();

  // Open context mode again.
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  fireEvent.press(getByTestId('report'));
  expect(onReport).toHaveBeenCalled();
  expect(queryByTestId('report')).not.toBeTruthy(); // Context mode close.

  // Open context mode again.
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  fireEvent.press(getByTestId('copy'));
  expect(onCopy).toHaveBeenCalled();
  expect(queryByTestId('copy')).not.toBeTruthy(); // Context mode close.
});

it('emit reaction pill events correctly', () => {
  const onReaction = jest.fn();
  const { getByText } = render(
    <Host>
      <TextMessage
        user={mockUser}
        message={mockMessage}
        messenger={messengerMock}
        isBlured={false}
        isSharedAnswer={false}
        canReport={true}
        onReport={(): void => {
          // void
        }}
        onCopy={(): void => {
          // void
        }}
        onReaction={(newReaction): void => {
          onReaction(newReaction);
        }}
      />
    </Host>,
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
