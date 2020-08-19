import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { useDispatch } from 'react-redux';

import st from '../../st';
import theme from '../../theme';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import { createAdventureStepMessage } from '../../actions/requests';
import { getCurrentUserId } from '../../utils/get';

import styles from './styles';

function AdventureStepMessageInput({ adventure, step, ...rest }) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const dispatch = useDispatch();
  const userId = getCurrentUserId();

  const handleSendMessage = () => {
    // Keyboard.dismiss();
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
    // }, 4000)
  };

  return (
    <Flex direction="row" style={styles.wrapper} align="center" value={1}>
      <TextInput
        autoCapitalize="sentences"
        // returnKeyType="send"
        // blurOnSubmit={true}
        // onSubmitEditing={handleSendMessage}
        placeholder={'Chat about your answers'} // TODO: Translate it.
        onChangeText={t => setText(t)}
        value={text}
        placeholderTextColor={theme.colors.secondary}
        underlineColorAndroid={st.colors.transparent}
        onContentSizeChange={event =>
          setInputHeight(event.nativeEvent.contentSize.height + 20)
        }
        style={styles.input}
        selectionColor={st.colors.yellow}
        autoCorrect={true}
        multiline={true}
        keyboardAppearance="dark"
        {...rest}
      />
      <Button
        style={styles.sendButton}
        onPress={handleSendMessage}
      >
        <VokeIcon name="send" style={styles.sendButtonIcon} size={25} />
      </Button>
    </Flex>
  );
}

export default AdventureStepMessageInput;
