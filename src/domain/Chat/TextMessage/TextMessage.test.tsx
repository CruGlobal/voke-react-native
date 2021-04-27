import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Host } from 'react-native-portalize';
import '@testing-library/jest-native';
import { messengerMock, mockMessage, mockUser } from 'mocks/vokeDataMocks';
import renderWithContext from 'utils/testUtils';

import TextMessage from './index';

const initialState = {
  auth: { user: mockUser },
  data: {},
};

it('renders correctly', () => {
  const { queryByText, toJSON } = renderWithContext(
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
      setContextActive={(): void => {
        // void.
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/John Doe/i)).toBeTruthy();
  expect(queryByText(/Test message content/i)).toBeTruthy();
  expect(queryByText(/Jan 25/i)).toBeTruthy();
  expect(queryByText(/Report/i)).not.toBeTruthy();
  expect(queryByText(/Copy/i)).not.toBeTruthy();
});

it('context mode renders correctly', () => {
  const { queryByText, queryByTestId, getByTestId, toJSON } = renderWithContext(
    <Host>
      <TextMessage
        user={mockUser}
        message={mockMessage}
        messenger={messengerMock}
        isBlured={false}
        isSharedAnswer={false}
        canReport={true}
        contextActive={null}
        onReport={(): void => {
          // void.
        }}
        onCopy={(): void => {
          // void.
        }}
        onReaction={(): void => {
          // void.
        }}
        setContextActive={(): void => {
          // void.
        }}
      />
    </Host>,
    { initialState },
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
  const { queryByText } = renderWithContext(
    <TextMessage
      user={mockUser}
      message={mockMessage}
      messenger={messengerMock}
      isBlured={false}
      isSharedAnswer={false}
      contextActive={null}
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
      setContextActive={(): void => {
        // void.
      }}
    />,
    { initialState },
  );

  expect(queryByText(/🤗 3/i)).toBeTruthy();
  expect(queryByText(/😄 1/i)).toBeTruthy();
  expect(queryByText(/♥️ 3/i)).toBeTruthy();
  expect(queryByText(/😂 1/i)).toBeTruthy();
});

it('emit events correctly', () => {
  let contextActiveState = null;
  const onSetContextActive = () => {
    contextActiveState = contextActiveState ? null : mockMessage.id;
  };
  const onReport = jest.fn();
  const onCopy = jest.fn();
  const onReaction = jest.fn(() => onSetContextActive());
  const { queryByTestId, getByTestId, rerender } = renderWithContext(
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
        contextActive={contextActiveState}
        setContextActive={(): void => {
          onSetContextActive();
        }}
      />
    </Host>,
    { initialState },
  );
  // Activate context mode.
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');

  rerender(
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
        contextActive={contextActiveState}
        setContextActive={(): void => {
          onSetContextActive();
        }}
      />
    </Host>,
  );
  expect(queryByTestId('reactionsPopup')).toBeTruthy();

  fireEvent(getByTestId('reaction-1'), 'onPressIn');
  expect(onReaction).toHaveBeenCalled();
  rerender(
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
        contextActive={contextActiveState}
        setContextActive={(): void => {
          onSetContextActive();
        }}
      />
    </Host>,
  );
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
  let contextActiveState = null;
  const onSetContextActive = () => {
    contextActiveState = mockMessage.id;
  };
  const { getByText } = renderWithContext(
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
        contextActive={contextActiveState}
        setContextActive={(): void => {
          onSetContextActive();
        }}
      />
    </Host>,
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
