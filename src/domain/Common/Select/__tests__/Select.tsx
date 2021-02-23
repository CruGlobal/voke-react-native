/**
 * @format
 */

import { Text } from 'react-native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

// import { toHaveStyle } from '@testing-library/jest-native'; - causes TS error.
// https://github.com/testing-library/jest-dom/issues/123
import '@testing-library/jest-native';
import Select from '../index';

const toggleLabel = 'Toggle Text Test';
const testOptions = [
  { label: 'Option Label 1' },
  { label: 'Option Label 2' },
  {
    label: 'Option Label 3',
    selected: true,
  },
  { label: 'Option Label 4' },
  { label: 'Option Label 5' },
];

// the modal component is automatically mocked by RN and apparently contains
// a bug which make the modal (and it's children) always visible in the test tree
// this is a hack which fix this issue
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal');
  // @ts-ignore
  return (props) => <Modal {...props} />;
});

beforeEach(() => {
  // https://github.com/facebook/jest/issues/6434#issuecomment-525576660
  jest.useFakeTimers();
});

it('renders correctly', () => {
  const { queryByText, toJSON } = render(
    <Select
      options={testOptions}
      // Toggle button:
      toggleText={toggleLabel}
      toggleTestId="toggleTestId"
      toggleTextStyle={{ color: 'red' }}
      // Selector state change:
      isOpen={false}
      onOpen={() => {}}
      onClose={() => {}}
      onSelect={() => {}}
      // Single option:
      optionEl={(option, key) => {
        return (
          <>
            <Text testID={'singleOption-' + key}>
              {option.label} {option?.selected ? ' - Selected' : ''}
            </Text>
          </>
        );
      }}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/Toggle Text Test/i)).toBeTruthy();
  expect(queryByText(/Toggle Text Test/i)).toHaveStyle({ color: 'red' });
  expect(queryByText(/Option Label 1/i)).not.toBeTruthy();
});

it('renders correctly when open', async () => {
  const { queryByTestId, queryByText, toJSON } = render(
    <Select
      options={testOptions}
      // Toggle button:
      toggleText={toggleLabel}
      toggleTestId="toggleTestId"
      toggleTextStyle={{ color: 'red' }}
      // Selector state change:
      isOpen={true}
      onOpen={() => {}}
      onClose={() => {}}
      onSelect={() => {}}
      // Single option:
      optionEl={(option, key) => {
        return (
          <>
            <Text testID={'singleOption-' + key}>
              {option.label} {option?.selected ? ' - Selected' : ''}
            </Text>
          </>
        );
      }}
    />,
  );

  expect(queryByText(/Option Label 1/i)).toBeTruthy();
  // Third option should be selected by default (following our test data).
  expect(queryByTestId('singleOption-2')).toHaveTextContent(/Selected/i);
  expect(toJSON()).toMatchSnapshot();
});

it('emits press events', async () => {
  const onPressOpen = jest.fn();
  const onPressClose = jest.fn();
  const onPressSelect = jest.fn();
  const { getByTestId } = render(
    <Select
      options={testOptions}
      // Toggle button:
      toggleText={toggleLabel}
      toggleTestId="toggleTestId"
      // Selector state change:
      isOpen={true}
      onOpen={onPressOpen}
      onClose={onPressClose}
      onSelect={(option, key) => {
        onPressSelect(option, key);
      }}
      // Single option:
      optionEl={(option, key) => {
        return (
          <>
            <Text testID={'singleOption-' + key}>
              {option.label} {option?.selected ? ' - Selected' : ''}
            </Text>
          </>
        );
      }}
    />,
  );

  fireEvent.press(getByTestId('toggleTestId'));
  expect(onPressOpen).toHaveBeenCalled();
  fireEvent.press(getByTestId('dropdownBackdrop'));
  expect(onPressClose).toHaveBeenCalled();
  fireEvent.press(getByTestId('singleOption-0'));
  expect(onPressSelect).toHaveBeenCalledWith({ label: 'Option Label 1' }, 0);
  expect(onPressClose).toHaveBeenCalled();
});
