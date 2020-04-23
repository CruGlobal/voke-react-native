import React, { useState } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import st from '../../st';
import theme from '../../theme';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import { createAdventureStepMessage } from '../../actions/requests';
import { useDispatch } from 'react-redux';

function AdventureStepMessageInput({ adventure, step, ...rest }) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const dispatch = useDispatch();

  function handleSendMessage() {
    Keyboard.dismiss();
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        value: text,
        kind: 'standard',
      })
    );
    setText('');
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
        returnKeyType="send"
        blurOnSubmit={true}
        onSubmitEditing={() => {}}
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
        multiline={false}
        {...rest}
      />
      <Button style={[st.w(55), st.aie, st.pv6]} onPress={handleSendMessage}>
        <VokeIcon name="send_message" style={[st.white]} size={20} />
      </Button>
    </Flex>
  );
}

export default AdventureStepMessageInput;
