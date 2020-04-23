import React from 'react';
import Image from 'react-native-scalable-image';
import { vokeImages } from '../../utils/iconMap';
import Flex from '../Flex';
import Text from '../Text';
import Triangle from '../Triangle';

import styles from './styles';

interface IBotTalking {
  reference?: React.RefObject<HTMLButtonElement>;
  children?: React.ReactNode;
}
/**
 * Displays speech bubble with Voke bot underneath.
 * Wraps provided content with <Text> element.
 */
const BotTalking: React.FC = ({reference, children}: IBotTalking): React.ReactElement => (
  <Flex style={styles.BotContainer}>
    <Flex style={styles.BotMessage}>
      <Text style={styles.BotText}>{children}</Text>
    </Flex>
    <Triangle
      width={20}
      height={20}
      flip
      slant="down"
      color={styles.colors.secondaryAlt}
      style={styles.BotMessageTail}
    />
    <Image width={80} style={styles.BotImage} source={vokeImages.vokebot} />
  </Flex>
);

export default BotTalking;
