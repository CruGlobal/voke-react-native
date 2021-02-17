import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native';
import {
  mockUser,
  mockStepDecisionInactive,
  mockMessageBinaryDefault,
  mockMessageBinarySelected,
  groupAdventureMock,
  mockMessageQuestion,
} from 'mocks/vokeDataMocks';
import renderWithContext from 'utils/testUtils';

import SpecialMessage from './index';

const initialState = {
  auth: { user: mockUser },
  data: {
    adventureStepMessages: {
      [mockStepDecisionInactive.id]: {},
    },
  },
};

beforeEach(() => {
  // https://github.com/facebook/jest/issues/6434#issuecomment-525576660
  jest.useFakeTimers();
});

it('renders correctly - kind "question" - not answered', () => {
  const { toJSON, queryByText, queryByTestId } = renderWithContext(
    <SpecialMessage
      message={mockMessageQuestion}
      nextMessage={null}
      kind="question"
      adventure={groupAdventureMock}
      step={mockStepDecisionInactive}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();

  expect(queryByText(/What led you to this response today/i)).toBeTruthy();
  expect(queryByTestId('inputEnterAnswer')).toBeTruthy();
  expect(queryByTestId('ctaSendAnswer')).toBeTruthy();
});

it('renders correctly - kind "question" - answered', () => {
  const { toJSON, queryByText, queryByTestId } = renderWithContext(
    <SpecialMessage
      message={mockMessageQuestion}
      nextMessage={{
        id: 'somemessageid',
        kind: 'text',
        content: 'Answer to the question',
        created_at: '2021-01-25T20:44:00.960Z',
        conversation_id: 'fb6e60b5-ddd2-4756-a1c5-4473cc2f6a72',
        direct_message: true,
      }}
      kind="question"
      adventure={groupAdventureMock}
      step={{ ...mockStepDecisionInactive, ...{ status: 'completed' } }}
      onFocus={(): void => {
        // void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();

  expect(queryByText(/What led you to this response today/i)).toBeTruthy();
  expect(queryByText(/Answer to the question/i)).toBeTruthy();
  expect(queryByTestId('inputEnterAnswer')).not.toBeTruthy();
  expect(queryByTestId('ctaSendAnswer')).not.toBeTruthy();
});

// TODO: FIX THIS TEST LATER
/* it('emit events correctly - kind "question"', async () => {
  const onFocus = jest.fn();
  const { store, getByTestId } = renderWithContext(
    <SpecialMessage
      message={mockMessageQuestion}
      nextMessage={null}
      kind="question"
      adventure={groupAdventureMock}
      step={mockStepDecisionInactive}
      onFocus={(): void => {
        onFocus();
      }}
    />,
    { initialState },
  );

  // Testing sending reply to the question.
  // store.clearActions();

  fireEvent(getByTestId('inputEnterAnswer'), 'onFocus');
  expect(onFocus).toHaveBeenCalled();

  fireEvent.changeText(getByTestId('inputEnterAnswer'), 'Some answer');
  fireEvent.press(getByTestId('ctaSendAnswer'));

  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
});
 */
