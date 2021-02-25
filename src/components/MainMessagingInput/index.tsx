import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { useTranslation } from 'react-i18next';
import st from 'utils/st';
import theme from 'utils/theme';
import { getCurrentUserId } from 'utils/get';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';

import OldButton from '../OldButton';
import { createAdventureStepMessage } from '../../actions/requests';

import styles from './styles';

function MainMessagingInput({ adventure, step, onFocus, ...rest }) {
  const { t } = useTranslation('journey');
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const dispatch = useDispatch();
  const userId = getCurrentUserId();
  const insets = useSafeArea();
  const keyboard = useKeyboard();
  const dynPadding = insets.bottom ? insets.bottom : theme.spacing.m;
  const bottomPadding = keyboard.keyboardShown ? theme.spacing.m : dynPadding;
  const handleSendMessage = () => {
    // Don't send empty messages.
    if (text.length === 0) {
      return;
    }

    // Give autocorrection a few ms to replace the text.
    // setTimeout(() => {
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        value: text,
        kind: 'standard',
        userId,
      }),
    );
    setText('');
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <TextInput
        autoCapitalize="sentences"
        placeholder={t('chatHere')} // TODO: Translate it.
        onChangeText={(t) => setText(t)}
        value={text}
        placeholderTextColor={theme.colors.secondary}
        underlineColorAndroid={st.colors.transparent}
        onContentSizeChange={(event) =>
          setInputHeight(event.nativeEvent.contentSize.height + 20)
        }
        style={styles.input}
        selectionColor={st.colors.yellow}
        autoCorrect={true}
        multiline={true}
        keyboardAppearance="dark"
        onFocus={onFocus}
        testID="inputMainChatInput"
        {...rest}
      />
      <OldButton style={styles.sendButton} onPress={handleSendMessage}>
        <VokeIcon name="send" style={styles.sendButtonIcon} size={22} />
      </OldButton>
    </View>
  );
}

export default MainMessagingInput;
