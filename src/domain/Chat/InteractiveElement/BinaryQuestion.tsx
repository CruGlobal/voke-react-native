import React from 'react';
import { TMessage } from 'utils/types';
import { StyleSheet, View } from 'react-native';
import Image from 'components/Image';
import Text from 'components/Text';
import LinearGradient from 'react-native-linear-gradient';
import Button from 'components/Button';

import styles from './styles';

interface Props {
  metadata: TMessage['metadata'];
  onValueSelected: (value: string) => void;
  isShareRequest?: boolean;
}

const BinaryQuestion = ({
  metadata,
  onValueSelected,
  isShareRequest,
}: Props): React.ReactElement => {
  const name = metadata?.name || '';
  const image = metadata?.image?.small || '';
  const comment = metadata?.comment || '';
  const answers = metadata?.answers || [];
  const question = metadata?.question || '';
  const hasSelected = answers.find(a => a.selected) ? true : false;
  return (
    <View style={isShareRequest ? styles.shareQBubble : styles.binaryBubble}>
      {image ? (
        <Image source={{ uri: image }} style={StyleSheet.absoluteFill} />
      ) : null}
      {isShareRequest ? (
        <Text style={styles.shareQName}>{name}</Text>
      ) : (
        <>
          <Text style={styles.binaryName}>{name}</Text>
          <Text style={styles.binaryComment}>{comment}</Text>
        </>
      )}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          isShareRequest ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,1)',
        ]}
        style={styles.mainQuestion}
      >
        <Text
          style={isShareRequest ? styles.shareQuestion : styles.binaryQuestion}
        >
          {question}
        </Text>
        <View style={styles.binaryOptionsWrap}>
          {answers.map((a, index) => (
            <Button
              key={index}
              disabled={hasSelected}
              testID={'binaryButton-' + index}
              color={a.selected ? 'blank' : 'accent'}
              onPress={(): void => {
                onValueSelected(a.value);
              }}
              style={[
                a.selected || !hasSelected ? { opacity: 1 } : { opacity: 0.4 },
              ]}
            >
              {a.key}
            </Button>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default BinaryQuestion;
