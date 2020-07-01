import React, { useState } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import st from '../../st';
import theme from '../../theme';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import { createAdventureStepMessage } from '../../actions/requests';
import { useDispatch } from 'react-redux';
import { getCurrentUserId } from '../../utils/get';
import useInterval from '../../utils/useInterval';


function AdventureStepMessageInput({ adventure, step, ...rest }) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const dispatch = useDispatch();
  const userId = getCurrentUserId();

  const handleSendMessage = () => {
    // Keyboard.dismiss();
    // Don't send empty messages.
    if ( text.length === 0 ) {
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
        userId
      })
    );
    setText('');
    // }, 4000)
  }

  return (
    <Flex
      direction="row"
      style={[st.pl5, inputHeight, st.btWhite, st.btw1,{backgroundColor: theme.colors.primary, paddingTop: 10}]}
      align="center"
      value={1}
    >
      <TextInput
        autoCapitalize="sentences"
        // returnKeyType="send"
        // blurOnSubmit={true}
        // onSubmitEditing={handleSendMessage}
        placeholder={'Chat about your answers'}
        onChangeText={t => setText(t)}
        value={text}
        placeholderTextColor={theme.colors.secondary}
        underlineColorAndroid={st.colors.transparent}
        onContentSizeChange={event =>
          setInputHeight(event.nativeEvent.contentSize.height + 20)
        }
        style={[st.f1, st.pv6, st.mv6, st.fs4, inputHeight, st.pt4, st.pb4, st.pl3, st.br2, st.mr5,{backgroundColor: theme.colors.white}]}
        selectionColor={st.colors.yellow}
        autoCorrect={true}
        multiline={true}
        {...rest}
      />
      <Button style={[st.w(45), st.h(45), st.aie, {backgroundColor: theme.colors.secondaryAlt, borderColor: theme.colors.secondaryAlt, borderRadius:23}]} onPress={handleSendMessage}>
        <VokeIcon name="send" style={[st.white, {marginRight:10, marginTop: 10, transform: [{ rotate: '45deg'}]}]} size={25} />
      </Button>
    </Flex>
  );
}

export default AdventureStepMessageInput;
