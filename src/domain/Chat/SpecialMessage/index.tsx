import InteractiveElement from 'domain/Chat/InteractiveElement';

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TAdventureSingle, TMessage, TStep } from 'utils/types';
import Flex from 'components/Flex';

import styles from './styles';

interface Props {
  message: TMessage;
  nextMessage: TMessage | null;
  kind: TStep['kind'];
  step: TStep;
  onFocus: (answerPosY: number) => void;
  adventure: TAdventureSingle;
}

const SpecialMessage = (props: Props): React.ReactElement => {
  const { adventure, message, nextMessage, kind, step, onFocus } = props;
  const [answerPosY, setAnswerPosY] = useState(0);

  let selectedAnswer =
    (((message?.metadata || {}).answers || []).find((i) => i?.selected) || {})
      .key || '';

  // If current message is a question box and next message is answer,
  // render the next message here (https://d.pr/i/YHrv4N).
  if (
    kind === 'question' &&
    !selectedAnswer &&
    message?.metadata?.vokebot_action === 'journey_step' &&
    nextMessage?.content &&
    nextMessage?.direct_message
  ) {
    selectedAnswer = nextMessage?.content;
  }

  return (
    <View
      style={styles.mainQuestionCard}
      onLayout={({ nativeEvent }): void => {
        // Calculate vertical offset to be used on the answer field focus.
        const layout = nativeEvent?.layout;
        if (layout && layout?.y && layout?.height) {
          setAnswerPosY(layout.y);
        }
      }}
    >
      <Flex direction="column" style={styles.mainQuestionContainer}>
        {kind === 'multi' || kind === 'question' ? (
          /* Message question area: */
          <Flex
            direction="column"
            style={styles.mainQuestion}
            align="center"
            justify="center"
          >
            <Text style={styles.questionText}>
              {(message?.metadata || {}).question || null}
            </Text>
          </Flex>
        ) : null}
        {/* Message input field / options / actions: */}
        <InteractiveElement
          kind={kind}
          adventure={adventure}
          step={step}
          internalMessage={message}
          defaultValue={selectedAnswer}
          onFocus={(): void => {
            onFocus(answerPosY);
          }}
        />
      </Flex>
    </View>
  );
};

export default SpecialMessage;
