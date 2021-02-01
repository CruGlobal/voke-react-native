import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Triangle from './Triangle';
import styles from './styles';

interface Props {
  onReaction: (newReaction: string) => void;
}

const Reactions = ({ onReaction }: Props): React.ReactElement => {
  const emojis = ['♥️', '😄', '😂', '🤗', '😓'];
  const onReactionSelected = (reaction: string): void => {
    onReaction(reaction);
  };
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={120}
      easing={'ease-in-out-cubic'}
      useNativeDriver={process.env.JEST_WORKER_ID ? false : true}
      style={styles.popupWrapper}
      testID="reactionsPopup"
    >
      <View style={styles.popup}>
        {emojis.map((emoji, index) => (
          <Pressable
            key={index}
            style={styles.emoji}
            onPressIn={(): void => {
              onReactionSelected(emoji);
            }}
            testID={'reaction-' + index}
          >
            <Text style={styles.emojiChar}>{emoji}</Text>
          </Pressable>
        ))}
      </View>
      <Triangle style={styles.popupTail} size={4} color="#eee" />
    </Animatable.View>
  );
};

export default Reactions;
