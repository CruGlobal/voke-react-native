import React, { useState } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import st from '../../st';
import theme from '../../theme';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import { createAdventureStepMessage } from '../../actions/requests';
import { useDispatch } from 'react-redux';
import useInterval from '../../utils/useInterval';

function AdventureStepMessageInput({ adventure, step, ...rest }) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const dispatch = useDispatch();

  const handleSendMessage = () => {
    // Keyboard.dismiss();
    // Don't send empty messages.
    if ( text.length === 0 ) {
      return;
    }

    // Give autocorrection a few ms to replace the text.
    // setTimeout(() => {
      console.log( "🐸 text:", text );
      dispatch(
        createAdventureStepMessage({
          adventure,
          step,
          value: text,
          kind: 'standard',
        })
      );
      setText('');
    // }, 4000)
  }

  return (
    <Flex
      direction="row"
      style={[st.pl5, inputHeight, {backgroundColor: theme.colors.secondary}]}
      align="center"
      value={1}
    >
      <TextInput
        autoCapitalize="sentences"
        // returnKeyType="send"
        // blurOnSubmit={true}
        // onSubmitEditing={handleSendMessage}
        placeholder={'New Message'}
        onChangeText={t => setText(t)}
        value={text}
        placeholderTextColor={st.colors.blue}
        underlineColorAndroid={st.colors.transparent}
        onContentSizeChange={event =>
          setInputHeight(event.nativeEvent.contentSize.height + 10)
        }
        style={[st.f1, st.white, st.pv6, st.mv6, st.fs4, inputHeight, st.pt4]}
        selectionColor={st.colors.yellow}
        autoCorrect={true}
        multiline={true}
        {...rest}
      />
      <Button style={[st.w(55), st.aie, st.pv4]} onPress={handleSendMessage}>
        <VokeIcon name="send" style={[st.white]} size={20} />
      </Button>
    </Flex>
  );
}

export default AdventureStepMessageInput;
