import React from 'react';
import { View } from 'react-native';
import st from 'utils/st';
import { TMessage } from 'utils/types';

import Text from '../Text';
import Flex from '../Flex';

import styles from './styles';

type Props = {
  message: TMessage;
  kind: TMessage['metadata']['step_kind']; // 'question' | 'regular' | 'binary' | 'multi' | 'share' | 'text',
  setAnswerPosY: (answerPosY: number) => void;
  inputField: React.ReactElement;
};

// Special message: QUESTION / MULTI / BINARY / SHARE
function MessageSpecial({
  message,
  kind,
  setAnswerPosY,
  inputField,
}: Props): React.ReactElement {
  return (
    <View
      style={styles.mainQuestionCard}
      onLayout={({ nativeEvent }) => {
        // Calculate vertical offset to be used on answer field focus.
        const layout = nativeEvent?.layout;
        if (layout && layout?.y && layout?.height) {
          setAnswerPosY(layout.y);
        }
      }}
    >
      <Flex direction="column" style={styles.mainQuestionContainer}>
        {kind === 'multi' || kind === 'question' ? (
          /* Message > Question Area: */
          <Flex
            direction="column"
            style={styles.mainQuestion}
            align="center"
            justify="center"
          >
            <Text style={[st.tac, st.white, st.fs(20), st.lh(24)]}>
              {(message?.metadata || {}).question || null}
            </Text>
          </Flex>
        ) : null}
        {/* <Image
            source={{ uri: (messenger.avatar || {}).small }}
            style={[st.absb, st.right(-30), st.h(25), st.w(25), st.br1]}
          /> */}
        {/* MESSAGE INPUT FIELD: */}
        {inputField}
      </Flex>
    </View>
  );
}

export default MessageSpecial;
