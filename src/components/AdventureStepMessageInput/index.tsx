import React, { useState } from 'react';
import { View, TextInput, Keyboard } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import { useDispatch } from 'react-redux';
import { createAdventureStepMessage } from '../../actions/requests';
import Select from '../Select';

const AdventureStepMessageInput = ({
  kind,
  adventure,
  step,
  internalMessage,
  defaultValue,
  onFocus,
}): React.ReactElement => {
  const [value, setValue] = useState(defaultValue || '');
  const [messageSent, setMesssageSent] = useState(!!defaultValue);
  const dispatch = useDispatch();
  const isMultiQuestion = kind === 'multi';
  const isBinaryQuestion = kind === 'binary';
  const isTextQuestion = kind === 'question';
  const isShareQuestion = kind === 'share';
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';
  const isComplete = step.status === 'completed';

  // When SEND message button clicked.
  const handleSendMessage = (newValue: any): void => {
    setMesssageSent(true);
    Keyboard.dismiss();
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        value: newValue || value,
        internalMessageId: internalMessage ? internalMessage.id : null,
        kind,
      })
    );
  };

  if (isMultiQuestion) {
    const answers = internalMessage
      ? (internalMessage.metadata || {}).answers
      : (step.metadata || {}).answers;
    if ((answers || []).length === 0) return <></>;

    let formattedAnswers = answers.map(a => ({
      value: a.value,
      label: a.key,
    }));
    if (isComplete) {
      formattedAnswers = formattedAnswers.map(a => ({
        ...a,
        disabled: true,
      }));
    }

    return (
      <Select
        isMulti={false}
        options={formattedAnswers}
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
        placeholder="Choose Your Answer..."
        selectedValue={value}
        onUpdate={t => {
          setValue(t.value);
          handleSendMessage(t.value);
        }}
        containerColor={st.colors.orange}
      />
    );
  }
  if (isBinaryQuestion) {
    const metadata = internalMessage.metadata || {};
    const answers = metadata.answers;
    const hasSelected = (answers || []).find(a => a.selected);
    return (
      <Flex direction="column" style={[st.mh1, st.mt4]}>
        <Flex direction="row">
          <Flex style={[st.f1]} />
          <Flex
            direction="column"
            align="center"
            style={[st.bgBlack, st.ovh, st.br5, st.w100]}
          >
            {(metadata.image || {}).small ? (
              <Image
                source={{ uri: metadata.image.small }}
                style={[st.absfill]}
              />
            ) : null}
            <Text style={[st.pd3, st.fs1, st.white]}>{metadata.name}</Text>
            <Text style={[st.ph3, st.tal, st.fs4, st.white]}>
              {metadata.comment}
            </Text>
            <Flex
              direction="column"
              align="center"
              style={[
                st.ph4,
                st.pv4,
                st.mt4,
                st.w100,
                {
                  marginRight: -20,
                  marginLeft: -20,
                  backgroundColor: st.colors.lightOrange,
                },
              ]}
            >
              <Text style={[[st.pv4, st.white, st.tac, st.fs20, st.lh(24)]]}>
                {metadata.question}
              </Text>
              <Flex direction="row">
                {answers.map((a, index) => (
                  <Button
                    disabled={hasSelected}
                    onPress={() => {
                      setValue(a.value);
                      handleSendMessage();
                    }}
                    style={[
                      a.selected ? st.bgWhite : st.bgOrange,
                      st.br1,
                      st.mh5,
                      st.ph2,
                      st.pv5,
                      a.selected || !hasSelected
                        ? { opacity: 1 }
                        : { opacity: 0.4 },
                    ]}
                  >
                    <Text style={[a.selected ? st.orange : st.white, st.fs18]}>
                      {a.key}
                    </Text>
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  if (isShareQuestion) {
    const metadata = internalMessage?.metadata || {};
    const answers = metadata.answers;
    const hasSelected = (answers || []).find(a => a.selected);
    return (
      <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
        <Flex direction="row">
          <Flex style={[st.f1]} />
          <Flex
            direction="column"
            align="center"
            style={[st.bgDarkBlue, st.br5, st.w100, st.pd4]}
          >
            <Text style={[[st.pd4, st.tac, st.fs(20), st.lh(24)]]}>
              {metadata.question}
            </Text>
            <Flex direction="row" style={[st.pb4]}>
              {answers.map((a, index) => (
                <Button
                  text={a.key}
                  disabled={hasSelected}
                  onPress={() => {
                    setValue(a.value);
                    handleSendMessage();
                  }}
                  style={[
                    a.selected ? st.bgWhite : st.bgOrange,
                    st.br1,
                    st.mh5,
                    a.selected || !hasSelected
                      ? { opacity: 1 }
                      : { opacity: 0.4 },
                  ]}
                  buttonTextStyle={[a.selected ? st.orange : st.white]}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
  // Text Question:
  // if (isTextQuestion)
  return (
    <Flex
      direction="row"
      align="center"
      style={[st.bgWhite, st.w100, st.pl4, st.brbl5, st.brbr5]}
    >
      {messageSent ? (
        <Text style={[st.fs4, st.pt4, st.pb4, st.darkBlue]}>{value}</Text>
      ) : (
        <>
          <TextInput
            autoCapitalize="sentences"
            returnKeyType="send"
            onFocus={event => {
              onFocus(event);
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
            multiline={false}
            blurOnSubmit={true}
            onSubmitEditing={handleSendMessage}
            placeholder={'Enter your answer'}
            placeholderTextColor={st.colors.grey}
            style={[st.f1, st.fs4, st.pt4, st.pb4, st.darkBlue, {marginRight:6}]}
            underlineColorAndroid={st.colors.transparent}
            selectionColor={st.colors.darkBlue}
            value={value}
            onChangeText={t => setValue(t)}
          />
          {!value && isSolo ? (
            <Button onPress={() => {}} style={[st.pv4]}>
              <Text style={[st.orange, st.bold, st.fs4, st.ls2]}>
                {'Skip'.toUpperCase()}
              </Text>
            </Button>
          ) : (
            <Button
              // onPress={handleSendMessage}
              onPress={() => {
                    // setValue(a.value);
                    console.log('clock');
                    handleSendMessage();
                  }}
              style={[st.p4]}>
              <VokeIcon name="send_message" style={[st.offBlue]} size={24} />
            </Button>
          )}
        </>
      )}
    </Flex>
  );
}

export default AdventureStepMessageInput;
