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
  type?: string
}
/**
 * Displays speech bubble with Voke bot underneath.
 * Wraps provided content with <Text> element.
 */
const BotTalking = ({reference, children, type}: IBotTalking): React.ReactElement => (
  type=== "reverse" ?
  <Flex style={styles.BotContainer}>
  <Flex style={styles.BotMessage_reverse}>
    <Text style={styles.BotText_reverse}>{children}</Text>
  </Flex>
  <Triangle
    width={20}
    height={20}
    flip
    slant="down"
    color={styles.colors.white}
    style={styles.BotMessageTail}
  />
  <Image width={110} style={styles.BotImage_reverse} source={vokeImages.VokeBot_Ukelele} />
</Flex>
:
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
