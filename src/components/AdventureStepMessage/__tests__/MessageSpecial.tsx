import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// import { openMainMenu } from 'utils/common';
// import { GET_CURRENT_USER_AVATAR } from '../queries';
import { TMessage } from 'utils/types';

import MessageSpecial from '../MessageSpecial';
// import { renderWithContext } from '../testUtils';

// jest.mock('utils/common');

beforeEach(() => {
  // (openMainMenu as jest.Mock).mockReturnValue({ type: 'open main menu' });
});

const mockMessage: TMessage = {
  id: 'abd11452-40c2-40fb-887c-9dd874fbe3b6',
  content: 'My answer to the main question',
  position: 1,
  messenger_id: '65c12ad3-f726-48e2-b4c5-6f15c6fb8f4e',
  conversation_id: 'fd8e29bb-c69c-42ea-a472-a63d7eb17c78',
  messenger_journey_step_id: '3782272b-6719-44ab-a0ab-441d4b6c733f',
  grouping_journey_step_id: '3782272b-6719-44ab-a0ab-441d4b6c733f',
  kind: 'text' as const,
  direct_message: false,
  item: null,
  reactions: [],
  adventure_message: true,
  metadata: {
    question: 'Main question text example?',
  },
  created_at: '2020-12-19T13:58:54.384Z',
};

it('renders question correctly', () => {
  // Arrange
  const { getByTestId, queryByTestId } = render(
    <MessageSpecial
      message={mockMessage}
      kind={'question' as const}
      setAnswerPosY={(posY: number) => {
        // setAnswerPosY(posY);
      }}
    /* inputField={
<AdventureStepMessageInput
kind={isMainAnswer ? step?.kind : msgKind}
adventure={adventure}
step={step}
internalMessage={isMainAnswer ? null : item}
defaultValue={isMainAnswer ? item.content : selectedAnswer}
onFocus={event => {
if (isMainAnswer && !hasClickedPlay) {
dispatch(
toastAction(
'Please watch the video first before you answer. Thanks!', //TODO: Translate it!
),
);
}
onFocus(event, answerPosY);
}}
/>
} */
    />,
  );
  // Act
  const component = getByTestId('MessageSpecial');
  // Assert
  expect(getByTestId('MessageSpecial')).toBe(component);
  expect(getByTestId('MessageContent')).toMatchSnapshot();
  // mockMessage.metadata.question,
  // .toBe(mockMessage.metadata.question);
  /* const renderResult = render(<MessageSpecial />);

  expect(renderResult.toJSON()).toMatchSnapshot();
  renderWithContext(<AdventureStepScreen />).snapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_CURRENT_USER_AVATAR, {
    fetchPolicy: 'cache-first',
  }); */
});

/* it('renders correctly', () => {
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
}); */

/* it('fires handlePress on click', async () => {
  const { getByTestId } = renderWithContext(<AdventureStepScreen />);
  await fireEvent.press(getByTestId('menuButton'));
  expect(openMainMenu).toHaveBeenCalled();
});
 */
