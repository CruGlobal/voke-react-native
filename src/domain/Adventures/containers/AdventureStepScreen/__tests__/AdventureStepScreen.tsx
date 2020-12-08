import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// import { openMainMenu } from 'utils/common';
// import { GET_CURRENT_USER_AVATAR } from '../queries';
import AdventureStepScreen from '../AdventureStepScreen';
// import { renderWithContext } from '../testUtils';

// jest.mock('utils/common');

beforeEach(() => {
  // (openMainMenu as jest.Mock).mockReturnValue({ type: 'open main menu' });
});

it('renders correctly', () => {
  const renderResult = render(
    React.cloneElement(<AdventureStepScreen />, { navigation }),
    {
      wrapper,
    },
  );

  expect(renderResult.toJSON()).toMatchSnapshot();

  renderWithContext(<AdventureStepScreen />).snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_CURRENT_USER_AVATAR, {
    fetchPolicy: 'cache-first',
  });
});

it('fires handlePress on click', async () => {
  const { getByTestId } = renderWithContext(<AdventureStepScreen />);
  await fireEvent.press(getByTestId('menuButton'));
  expect(openMainMenu).toHaveBeenCalled();
});
