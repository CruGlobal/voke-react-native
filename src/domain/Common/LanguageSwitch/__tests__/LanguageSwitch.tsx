/**
 * @format
 */

import { Text, View } from 'react-native';
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

// import { toHaveStyle } from '@testing-library/jest-native'; - causes TS error.
// https://github.com/testing-library/jest-dom/issues/123
import '@testing-library/jest-native';
import i18n from 'i18next';

import LanguageSwitch from '../index';

// the modal component is automatically mocked by RN and apparently contains
// a bug which make the modal (and it's children) always visible in the test tree
// this is a hack which fix this issue
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal');
  return (props) => <Modal {...props} />;
});

beforeEach(() => {
  // https://github.com/facebook/jest/issues/6434#issuecomment-525576660
  jest.useFakeTimers();
});

it('renders correctly', () => {
  const { queryByText, toJSON } = render(<LanguageSwitch />);

  expect(toJSON()).toMatchSnapshot();
  expect(queryByText(/English/i)).toBeTruthy();
  expect(queryByText(/FR/i)).not.toBeTruthy();
});

it('renders correct languages when open', async () => {
  const {
    getByTestId,
    queryByTestId,
    getByText,
    queryByText,
    toJSON,
    debug,
  } = render(<LanguageSwitch />);

  // FR language should be hidden first.
  expect(queryByText(/FR/i)).not.toBeTruthy();
  // Press on the language switch.
  fireEvent.press(getByTestId('languageSwitchButton'));
  // FR language present in the dropdown.
  expect(queryByText(/FR/i)).toBeTruthy();
  expect(queryByText(/ES/i)).toBeTruthy();
  expect(queryByText(/PT/i)).toBeTruthy();
  expect(queryByText(/\bEN\b/i)).toBeTruthy();
  expect(queryByTestId(/selected-fr/i)).not.toBeTruthy();
  expect(queryByTestId(/selected-en/i)).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});

it('select new language when pressed', async () => {
  const {
    getByTestId,
    queryByTestId,
    getByText,
    queryByText,
    toJSON,
    debug,
  } = render(
    <View>
      <Text>{i18n.t('welcome:botMessageTitle')}</Text>
      <LanguageSwitch />
    </View>,
  );

  // FR language should be hidden first.
  expect(queryByText(/French/i)).not.toBeTruthy();
  // Check current string output.
  expect(queryByText(/Welcome to Voke!/i)).toBeTruthy();
  // Press on the language switch.
  fireEvent.press(getByTestId('languageSwitchButton'));
  // FR language present in the dropdown.
  fireEvent.press(getByText(/FR/i));
  // Dropdown should disappear.
  expect(queryByText(/ES/i)).not.toBeTruthy();
  // Current language label changed.
  expect(queryByText(/French/i)).toBeTruthy();
  // Check output change in i18n.
  expect(i18n.t('welcome:botMessageTitle') === 'Bienvenue à Voke!');
  // Check checkmark inside of the modal.
  fireEvent.press(getByTestId('languageSwitchButton'));
  expect(queryByTestId(/selected-en/i)).not.toBeTruthy();
  expect(queryByTestId(/selected-fr/i)).toBeTruthy();
});
