import Button from 'components/Button';
import Text from 'components/Text';
import VokeIcon from 'components/VokeIcon';
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput } from 'react-native';
import st from 'utils/st';

import styles from './styles';

interface Props {
  messageSent: boolean;
  isComplete: boolean;
  onFocus: () => void;
  value: string | null;
  sendMessage: (value: string) => void;
}

const TextQuestion = ({
  messageSent,
  isComplete,
  onFocus,
  value,
  sendMessage,
}: Props): ReactElement => {
  const { t } = useTranslation('journey');
  const [draft, setDraft] = useState('');

  if (messageSent || isComplete) {
    return (
      <View style={styles.answerContainer}>
        {value || draft ? (
          <Text style={styles.answerText}>{value ? value : draft}</Text>
        ) : (
          <Text
            style={[st.fs4, st.pt4, st.pb4, { width: '100%', opacity: 0.5 }]}
          >
            Skipped
          </Text>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.answerContainer}>
        <TextInput
          autoCapitalize="sentences"
          onFocus={(): void => {
            onFocus();
          }}
          multiline={true}
          placeholder={t('enterAnswer')}
          placeholderTextColor={st.colors.grey}
          style={styles.answerTextInput}
          underlineColorAndroid={st.colors.transparent}
          selectionColor={st.colors.darkBlue}
          value={value ? value : draft}
          onChangeText={(text): void => setDraft(text)}
          keyboardAppearance="dark"
          testID="inputEnterAnswer"
        />
        <Button
          onPress={(): void => {
            sendMessage(draft);
          }}
          style={styles.buttonSend}
          color="transparent"
          testID="ctaSendAnswer"
          size="l"
        >
          <VokeIcon name="send" style={styles.iconSend} size={24} />
        </Button>
      </View>
    );
  }
};

export default TextQuestion;
