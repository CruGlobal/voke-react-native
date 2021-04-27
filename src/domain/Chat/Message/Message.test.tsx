import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Host } from 'react-native-portalize';
import '@testing-library/jest-native';
import {
  groupAdventureMock,
  stepMock,
  mockMyMessage,
  soloAdventureMock,
  botMessageMock,
  mockUser,
  mockMessage,
  mockStepDecisionInactive,
  mockMessageBinaryDefault,
  mockMessageBinarySelected,
} from 'mocks/vokeDataMocks';
import renderWithContext from 'utils/testUtils';

import Message from './index';

const initialState = {
  auth: { user: mockUser },
  data: {
    adventureSteps: {},
    adventureStepMessages: {
      [mockStepDecisionInactive.id]: {},
    },
  },
};

it('renders correctly in group adventure', () => {
  const { toJSON } = renderWithContext(
    <Message
      adventure={groupAdventureMock}
      step={stepMock}
      item={mockMessage}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders correctly in solo adventure', () => {
  const { toJSON } = renderWithContext(
    <Message
      adventure={soloAdventureMock}
      step={stepMock}
      item={mockMessage}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it("don't render own message in solo adventure", () => {
  const { toJSON } = renderWithContext(
    <Message
      adventure={soloAdventureMock}
      step={stepMock}
      item={mockMyMessage}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toBe(null);
});

it('blur others decision messages in multichoise until I answer', () => {
  const { toJSON } = renderWithContext(
    <Message
      adventure={groupAdventureMock}
      step={mockStepDecisionInactive}
      item={mockMessage}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );
  expect(toJSON()).toMatchSnapshot();
});

it('render binary step (decision/pray) - no option selected', () => {
  const { toJSON, queryByText } = renderWithContext(
    <Message
      adventure={groupAdventureMock}
      step={mockStepDecisionInactive}
      item={mockMessageBinaryDefault}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );
  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/Jesus/i)).toBeTruthy();
  expect(queryByText(/Not yet/i)).toBeTruthy();
  expect(queryByText(/I just did/i)).toBeTruthy();
});

it('render binary step (decision/pray) - one selected', () => {
  const { toJSON, queryByText } = renderWithContext(
    <Message
      adventure={groupAdventureMock}
      step={mockStepDecisionInactive}
      item={mockMessageBinarySelected}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/Jesus/i)).toBeTruthy();
  expect(queryByText(/Not yet/i)).toBeTruthy();
  expect(queryByText(/I just did/i)).toBeTruthy();
});

it('renders correctly bot message in solo adventure', () => {
  const { toJSON } = renderWithContext(
    <Message
      adventure={soloAdventureMock}
      step={stepMock}
      item={botMessageMock}
      next={null}
      previous={null}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('emit events correctly', () => {
  const { store, getByTestId, queryByText } = renderWithContext(
    <Host>
      <Message
        adventure={groupAdventureMock}
        step={stepMock}
        item={mockMessage}
        next={null}
        previous={null}
        onFocus={(): void => {
          // void
        }}
      />
    </Host>,
    { initialState },
  );
  // Test opening context mode.
  // See if Report and Copy options are not visible initially and appear later.
  expect(queryByText(/Report/i)).not.toBeTruthy();
  expect(queryByText(/Copy/i)).not.toBeTruthy();
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  expect(queryByText(/Report/i)).toBeTruthy();
  expect(queryByText(/Copy/i)).toBeTruthy();

  // Testing Report functionality.
  store.clearActions();
  fireEvent.press(getByTestId('report'));
  let actions = store.getActions();
  expect(actions).toMatchInlineSnapshot(`
    Array [
      Object {
        "description": "Create complain",
        "props": Object {
          "adventureId": "3abf11de-773b-473f-afb9-8e3aeb258167",
          "messageId": "d64a1b4e-3214-4c31-b46a-24ca9e946ab2",
        },
        "type": "SET_COMPLAIN",
      },
    ]
  `);
  // Context closed at this point.
  // ---------------------------------------
  // Testing Copy to clipboard functionality.
  store.clearActions();
  fireEvent(getByTestId('messagePressArea'), 'onLongPress');
  fireEvent.press(getByTestId('copy'));
  actions = store.getActions();
  expect(actions).toMatchInlineSnapshot(`
    Array [
      Object {
        "description": "Show message: copied. Called from toastAction()",
        "props": Object {
          "text": "copied",
          "timeout": 1500,
        },
        "type": "SET_TOAST",
      },
    ]
  `);
});
