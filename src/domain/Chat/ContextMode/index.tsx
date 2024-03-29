import Reactions from 'domain/Chat/Reactions';
import ContextActions from 'domain/Chat/ContextActions';

import * as Animatable from 'react-native-animatable';
import React, { ReactElement } from 'react';
import { Pressable } from 'react-native';
import { Portal } from 'react-native-portalize';

import styles from './styles';

interface Props {
  active: boolean; // Context menu/mode activated.
  children: ReactElement; // Children to render in the context modal.
  onClose: () => void; // On context mode close.
  canReport: boolean; // If current message can be reported.
  onReport: () => void; // On 'Report' button press.
  onCopy: () => void; // On 'Copy' button press.
  onReaction: (newReaction: string) => void; // On 'Copy' button press.
}

const ContextMode = (props: Props): React.ReactElement => {
  const {
    active,
    children,
    onClose,
    canReport,
    onReport,
    onCopy,
    onReaction,
  } = props;
  if (active) {
    return (
      <>
        {/* Hidden overlay to make modal close on pressing outside. */}
        {/* This is used to dim background and capture taps on iPhone */}
        {/* It won't capture Adroid taps due to bug in RN */}
        {/* For Android capture element see: contextOffAndroid */}
        <Pressable
          style={styles.overlay}
          onPressIn={(): void => {
            onClose();
          }}
          onPress={(): void => {
            onClose();
          }}
          testID="contextOffiPhone"
        />
        <Animatable.View
          style={styles.animatedBubble}
          animation="pulse"
          duration={500}
          useNativeDriver={process.env.JEST_WORKER_ID ? false : true}
          // Native drives isn't available in test environment.
        >
          <Reactions
            onReaction={(newReaction): void => {
              onReaction(newReaction);
            }}
          />
          {/* Message block. */}
          {children}
        </Animatable.View>
        {/* Bottom 'actions' panel. */}
        <Portal>
          <ContextActions
            canReport={canReport}
            onReport={(): void => {
              onReport();
            }}
            onCopy={(): void => {
              onCopy();
            }}
          />
        </Portal>
      </>
    );
  } else {
    return children;
  }
};

export default ContextMode;
