import React, { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import styles from './styles';

interface Props {
  reactions: {
    [emoji: string]: string[];
  };
  isMyMessage: boolean;
  onReaction: (newReaction: string) => void;
}

const ReactionPills = (props: Props): React.ReactElement => {
  const { reactions, isMyMessage, onReaction } = props;
  // Animatable library has a very broken and confusing typing.
  const pillRef = useRef<any[]>([]);

  if (!reactions) {
    return <></>;
  }

  return (
    <View
      style={[
        styles.reactions,
        {
          // Reaction pills located on left for my messages
          // and on the right for other user messages.
          justifyContent: isMyMessage ? 'flex-start' : 'flex-end',
        },
      ]}
    >
      {Object.entries(reactions).map(([emoji, votes], index) => (
        <Animatable.View
          key={index}
          ref={(ref): void => {
            pillRef.current[index] = ref;
          }}
          useNativeDriver={process.env.JEST_WORKER_ID ? false : true}
          // Native drives isn't available in test environment.
        >
          <Pressable
            onPress={(): void => {
              if (!isMyMessage) {
                pillRef.current[index].tada(400);
                onReaction(emoji);
              }
            }}
            style={styles.reactionPill}
            testID={'reactionPill-' + index}
          >
            <Text style={styles.reactionLabel}>
              {emoji} {votes.length}
            </Text>
          </Pressable>
        </Animatable.View>
      ))}
    </View>
  );
};

export default ReactionPills;
