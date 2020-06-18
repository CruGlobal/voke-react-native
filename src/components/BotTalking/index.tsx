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
  heading?: string
}
/**
 * Displays speech bubble with Voke bot underneath.
 * Wraps provided content with <Text> element.
 */
const BotTalking = ({reference, children, type, heading}: IBotTalking): React.ReactElement => (
  type=== "reverse" ?
  <Flex style={styles.BotContainer}>
  {children? <Flex style={styles.BotMessage_reverse}>
    <Text style={styles.BotText_reverse}>{children}</Text>
  </Flex>: null}
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
type=== "overlay" ?
<Flex style={styles.BotContainer}>
<Flex style={styles.BotMessage_overlay}>
{ heading ?<Text style={styles.BotHeading_overlay}>{heading}</Text>:null}
{ children? <Text style={styles.BotText_reverse}>{children}</Text>:null}
</Flex>
<Triangle
  width={20}
  height={20}
  flip
  slant="down"
  color={styles.colors.white}
  style={styles.BotMessageTail}
/>
<Image width={150} style={styles.BotImage_overlay} source={vokeImages.vokebot} />
</Flex>
:
<Flex style={styles.BotContainer}>
  <Flex style={styles.BotMessage}>
    { heading ?<Text style={styles.BotHeading}>{heading}</Text>:null}
    {children? <Text style={styles.BotText}>{children}</Text>: null}
  </Flex>
  <Triangle
    width={20}
    height={20}
    flip
    slant="down"
    color={styles.colors.secondary}
    style={styles.BotMessageTail}
  />
  <Image width={150} style={styles.BotImage} source={vokeImages.vokebot} />
</Flex>

);

export default BotTalking;
