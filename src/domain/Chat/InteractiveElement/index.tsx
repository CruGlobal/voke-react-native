import Options from 'domain/Chat/Options';

import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getCurrentUserId } from 'utils/get';
import { TAdventureSingle, TMessage, TStep } from 'utils/types';
import { createAdventureStepMessage } from 'actions/requests';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Flex from 'components/Flex';
import OldButton from 'components/OldButton';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';
import st from 'utils/st';

import BinaryQuestion from './BinaryQuestion';
import styles from './styles';
import MultiQuestion from 'domain/Chat/InteractiveElement/MultiQuestion';

interface Props {
  kind: TStep['kind'];
  adventure: TAdventureSingle;
  step: TStep;
  internalMessage?: TMessage;
  defaultValue: string;
  onFocus: () => void;
  isLoading?: boolean; // TODO: remove?
}

const InteractiveElement = ({
  kind,
  adventure,
  step,
  internalMessage,
  defaultValue,
  onFocus,
  isLoading = false,
}: Props): React.ReactElement => {
  const { t } = useTranslation('journey');
  const dispatch = useDispatch();
  const userId = getCurrentUserId();
  const [value, setValue] = useState(defaultValue || null);
  const [draft, setDraft] = useState(null);
  const [messageSent, setMesssageSent] = useState(false);
  const isLocked = step && step['completed_by_messenger?'];
  const isComplete = step?.status === 'completed';
  const isMultiQuestion = kind === 'multi';
  const isShareQuestion = kind === 'share';
  const isBinaryQuestion = kind === 'binary';

  const currentMessages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[step?.id] || [],
  );

  // In case component rendered before default/current value
  // fetched from the server.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!currentMessages.length) {
      setMesssageSent(false);
    } else if (isComplete || value) {
      setMesssageSent(true);
    } else {
      for (const [, msg] of Object.entries(currentMessages)) {
        if (
          msg.messenger_id === userId &&
          !msg?.metadata?.question &&
          msg?.kind !== 'answer'
        ) {
          setMesssageSent(true);
          break;
        }
      }
    }
  }, [currentMessages.length]);

  // When SEND message button clicked.
  const handleSendMessage = (newValue: string): void => {
    setMesssageSent(true);
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        value: newValue,
        internalMessage: internalMessage ? internalMessage : null,
        kind,
        userId,
      }),
    );
  };

  if (isMultiQuestion) {
    const answers = internalMessage
      ? internalMessage?.metadata?.answers
      : step?.metadata?.answers;
    <MultiQuestion answers={answers} isComplete={isComplete} isLocked={isLocked} selected={value} onItemSelected={(item): void => {
          setValue(item.label || '');
              handleSendMessage(item.value);
        }}/>
  }

  if (isBinaryQuestion && internalMessage?.metadata) {
    return (
      <BinaryQuestion
        metadata={internalMessage?.metadata}
        onValueSelected={(val): void => {
          setValue(val);
          handleSendMessage(val);
        }}
      />
    );
  }

  if (isShareQuestion) {
    const metadata = internalMessage?.metadata || {};
    const { answers } = metadata;
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
              {answers.map(a => (
                <OldButton
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
                </OldButton>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  // Regular.
  return (
    <Flex
      direction="row"
      align="center"
      style={styles.answerContainer}
      // style={[st.bgWhite, st.w100, st.pl4, st.brbl5, st.brbr5]}
    >
      {isLoading ? (
        <View style={[st.w100]}>
          <Text style={styles.answerTextLoading}>.</Text>
        </View>
      ) : messageSent || isComplete ? (
        value || draft ? (
          <Text style={styles.answerText}>{value ? value : draft}</Text>
        ) : (
          <Text style={[st.fs4, st.pt4, st.w100, st.pb4, { opacity: 0.5 }]}>
            Skipped
          </Text>
        )
      ) : (
        <>
          <TextInput
            autoCapitalize="sentences"
            onFocus={event => {
              onFocus(event);
            }}
            multiline={true}
            placeholder={t('enterAnswer')}
            placeholderTextColor={st.colors.grey}
            style={[
              st.f1,
              st.fs4,
              st.pt4,
              st.pb4,
              st.darkBlue,
              { marginRight: 6 },
            ]}
            underlineColorAndroid={st.colors.transparent}
            selectionColor={st.colors.darkBlue}
            value={value ? value : draft}
            onChangeText={t => setDraft(t)}
            keyboardAppearance="dark"
            testID="inputEnterAnswer"
          />
          <OldButton
            onPress={() => {
              handleSendMessage(draft);
            }}
            style={styles.buttonSend}
            testID="ctaSendAnswer"
          >
            <VokeIcon name="send" style={styles.iconSend} size={24} />
          </OldButton>
        </>
      )}
    </Flex>
  );
};

export default InteractiveElement;
