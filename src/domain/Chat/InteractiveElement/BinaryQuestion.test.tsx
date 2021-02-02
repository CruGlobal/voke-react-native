import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Host } from 'react-native-portalize';
// import { toHaveStyle } from '@testing-library/jest-native'; - causes TS error.
// https://github.com/testing-library/jest-dom/issues/123
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

import BinaryQuestion from './BinaryQuestion';

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

it('renders correctly binary question - default', () => {
  const { toJSON } = renderWithContext(
    <BinaryQuestion
      metadata={mockMessageBinaryDefault.metadata}
      onValueSelected={(): void => {
        //void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders correctly binary question - selected', () => {
  const { toJSON } = renderWithContext(
    <BinaryQuestion
      metadata={mockMessageBinarySelected.metadata}
      onValueSelected={(): void => {
        //void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders correctly binary question - partial data', () => {
  const { toJSON } = renderWithContext(
    <BinaryQuestion
      metadata={{
        messenger_journey_step_id: '1693da4d-a8bd-40e3-99fd-913a1c8df372',
        step_kind: 'binary',
        vokebot_action: 'journey_step',
      }}
      onValueSelected={(): void => {
        //void
      }}
    />,
    { initialState },
  );

  expect(toJSON()).toMatchSnapshot();
});

it('emit events correctly for binary question', () => {
  const onValueSelected = jest.fn();
  const { getByTestId } = renderWithContext(
    <BinaryQuestion
      metadata={mockMessageBinaryDefault.metadata}
      onValueSelected={(val): void => {
        onValueSelected(val);
      }}
    />,
    { initialState },
  );

  fireEvent.press(getByTestId('binaryButton-0'));
  expect(onValueSelected).toHaveBeenCalledWith(
    '26cbf173-bb2f-4ccf-b3c9-11ed98733790',
  );
  onValueSelected.mockClear();

  fireEvent.press(getByTestId('binaryButton-1'));
  expect(onValueSelected).toHaveBeenCalledWith(
    'fa9bd7f8-4016-4c10-b7ec-70871f74bcc6',
  );
});

it('not emiting events in binary question when already selected', () => {
  const onValueSelected = jest.fn();
  const { getByTestId } = renderWithContext(
    <BinaryQuestion
      metadata={mockMessageBinarySelected.metadata}
      onValueSelected={(val): void => {
        onValueSelected(val);
      }}
    />,
    { initialState },
  );

  fireEvent.press(getByTestId('binaryButton-0'));
  expect(onValueSelected).not.toHaveBeenCalled();
});
