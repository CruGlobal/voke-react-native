import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Text from '../Text';

function AdventureStepMessageInput({ kind, adventure, step }) {
  const [text, setText] = useState('');

  const isMultiQuestion = kind === 'multi';
  const isBinaryQuestion = kind === 'binary';
  const isTextQuestion = kind === 'question';
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'group';

  if (isTextQuestion) {
    return (
      <Flex
        direction="row"
        align="center"
        style={[st.bgWhite, st.w100, st.ph4, st.brbl5, st.brbr5]}
      >
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="send"
          onFocus={() => {
            // if (this.props.hasClickedPlay) {
            //   return;
            // } else {
            //   this.props.dispatch(
            //     toastAction(
            //       'Please watch the video first before you answer. Thanks!',
            //     ),
            //   );
            // }
          }}
          multiline={true}
          blurOnSubmit={true}
          onSubmitEditing={() => {}}
          placeholder={'Enter your answer'}
          placeholderTextColor={st.colors.grey}
          style={[st.f1, st.fs4, st.pt4, st.pb4, st.darkBlue]}
          underlineColorAndroid={st.colors.transparent}
          selectionColor={st.colors.darkBlue}
          value={text}
          onChangeText={t => setText(t)}
        />
        {!text && isSolo ? (
          <Button onPress={() => {}} style={[st.pv4]}>
            <Text style={[st.orange, st.bold, st.fs4, st.ls2]}>
              {'skip'.toUpperCase()}
            </Text>
          </Button>
        ) : (
          <Button onPress={() => {}} style={[st.pv4]}>
            <VokeIcon name="send_message" style={[st.offBlue]} size={24} />
          </Button>
        )}
      </Flex>
    );
  }
}

export default AdventureStepMessageInput;
