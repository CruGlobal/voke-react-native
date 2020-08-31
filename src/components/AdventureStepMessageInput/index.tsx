import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import Image from '../Image';
import st from '../../st';
import styles from './styles'
import Flex from '../Flex';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import { useDispatch, useSelector } from 'react-redux';
import { createAdventureStepMessage } from '../../actions/requests';
import Select from '../Select';
import { getCurrentUserId } from '../../utils/get';

const AdventureStepMessageInput = ({
  kind,
  adventure,
  step,
  internalMessage,
  defaultValue,
  onFocus,
  isLoading,
}): React.ReactElement => {
  const dispatch = useDispatch();
  const userId = getCurrentUserId();
  const [value, setValue] = useState(defaultValue||null);
  const [draft, setDraft] = useState(null);
  const [messageSent, setMesssageSent] = useState(false);
  const isMultiQuestion = kind === 'multi';
  const isBinaryQuestion = kind === 'binary';
  const isShareQuestion = kind === 'share';
  const isComplete = step.status === 'completed';
  const isLocked = step['completed_by_messenger?'];

  const currentMessages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[step?.id] || []
  );

  // In case component rendered before default/current value fetched from the server.
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if(!currentMessages.length) {
      setMesssageSent(false);
    } else if( isComplete || value ) {
      setMesssageSent(true);
    } else {
      for ( let [key, msg] of Object.entries(currentMessages) ) {
        if( msg.messenger_id === userId && !msg?.metadata?.question && msg?.kind!=='answer' ) {
          setMesssageSent(true);
          break;
        }
      }
    }
  }, [currentMessages.length])

  // When SEND message button clicked.
  const handleSendMessage = (newValue: any): void => {
    setMesssageSent(true);
    // Keyboard.dismiss();
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        // value: newValue || value,
        value: newValue,
        internalMessage: internalMessage ? internalMessage : null,
        kind,
        userId
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
      <View style={[st.ovh, {
        backgroundColor: st.colors.white,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }]}>
      <Select
        options={formattedAnswers}
        onFocus={event => {
              onFocus(event);
        }}
        // placeholder="Choose Your Answer..."
        selectedValue={value}
        onUpdate={t => {
          setValue(t.value);
          handleSendMessage(t.value);
        }}
        containerColor={st.colors.orange}
        isDisabled={ isLocked  }
      />
      </View>
    );
  }

  if (isBinaryQuestion) {
    const metadata = internalMessage.metadata || {};
    const answers = metadata.answers;
    const hasSelected = (answers || []).find(a => a.selected);
    return (
      <Flex direction="column" style={[st.mt4]}>
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
            <Text style={[st.ph3, st.tal, st.fs3, st.white]}>
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
                      handleSendMessage(a.value);
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
      <Flex direction="column" style={[st.w100, st.mt4]}>
        <Flex direction="row">
          <Flex style={[st.f1]} />
          <Flex
            direction="column"
            align="center"
            style={[st.bgDarkBlue, st.br5, st.w100, st.pd4]}
          >
            <Text style={[[st.pd4, st.tac, st.fs(20), st.lh(24), st.white]]}>
              {metadata.question}
            </Text>
            <Flex direction="row" style={[st.pb4]}>
              {answers.map((a) => (
                <Button
                  disabled={hasSelected}
                  onPress={() => {
                    setValue(a.value);
                    handleSendMessage(a.value);
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
                ><Text style={[a.selected ? st.orange : st.white, st.fs18]}>{a.key}</Text></Button>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      direction="row"
      align="center"
      style={[st.bgWhite, st.w100, st.pl4, st.brbl5, st.brbr5]}
    >
      { isLoading ?
        <View style={[st.w100]}>
          <Text style={[st.fs4, st.pt4, st.w100, st.pb4, st.op0]}>.</Text>
        </View> :
        messageSent || isComplete ? (
          value || draft ?
            <Text style={[st.fs4, st.pt4, st.w100, st.pb4, st.darkBlue]}>{value ? value : draft}</Text> :
            <Text style={[st.fs4, st.pt4, st.w100, st.pb4, {opacity:.5}]}>Skipped</Text>
        ) : (
          <>
            <TextInput
              autoCapitalize="sentences"
              onFocus={event => {
                onFocus(event);
              }}
              multiline={true}
              placeholder={'Enter your answer'} // TODO: Translate!
              placeholderTextColor={st.colors.grey}
              style={[st.f1, st.fs4, st.pt4, st.pb4, st.darkBlue, {marginRight:6}]}
              underlineColorAndroid={st.colors.transparent}
              selectionColor={st.colors.darkBlue}
              value={value ? value : draft}
              onChangeText={t => setDraft(t)}
              keyboardAppearance="dark"
            />
            <Button
              onPress={() => {
                handleSendMessage(draft);
              }}
              style={[st.p4]}>
              <VokeIcon name="send" style={styles.iconSend} size={24} />
            </Button>
          </>
        )
      }
    </Flex>
  );
}

export default AdventureStepMessageInput;
