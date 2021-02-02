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
}

const BinaryQuestion = ({
  metadata,
  onValueSelected,
}: Props): React.ReactElement => {
  const image = metadata?.image?.small || '';
  const name = metadata?.name || '';
  const comment = metadata?.comment || '';
  const question = metadata?.question || '';
  const answers = metadata?.answers || [];
  const hasSelected = answers.find(a => a.selected) ? true : false;
  return (
    <View style={styles.binaryBubble}>
      {image ? (
        <Image source={{ uri: image }} style={StyleSheet.absoluteFill} />
      ) : null}
      <Text style={styles.binaryName}>{name}</Text>
      <Text style={styles.binaryComment}>{comment}</Text>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,5)']}
        style={styles.mainQuestion}
      >
        <Text style={styles.binaryQuestion}>{question}</Text>
        <View style={styles.binaryOptionsWrap}>
          {answers.map((a, index) => (
            <Button
              key={index}
              disabled={hasSelected}
              onPress={(): void => {
                onValueSelected(a.value);
              }}
              color={a.selected ? 'blank' : 'accent'}
              style={[
                a.selected || !hasSelected ? { opacity: 1 } : { opacity: 0.4 },
              ]}
              testID={'binaryButton-' + index}
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
