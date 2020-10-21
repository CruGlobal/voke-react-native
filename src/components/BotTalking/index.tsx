import React from 'react';
import Image from 'react-native-scalable-image';

import { vokeImages } from '../../utils/iconMap';
import Flex from '../Flex';
import Text from '../Text';
import Triangle from '../Triangle';
import theme from '../../theme';

import styles from './styles';
import { View } from 'react-native';
// import { Image } from 'react-native';

interface IBotTalking {
  reference?: React.RefObject<HTMLButtonElement>;
  children?: React.ReactNode;
  type?: string;
  heading?: string;
  style?: any;
}
/**
 * Displays speech bubble with Voke bot underneath.
 * Wraps provided content with <Text> element.
 */
const BotTalking = ({
  reference,
  children,
  type,
  heading,
  style,
}: IBotTalking): React.ReactElement =>
  type === 'reverse' ? (
    <Flex style={[styles.BotContainer, style]}>
      {children ? (
        <Flex style={styles.BotMessage_reverse}>
          <Text style={styles.BotText_reverse}>{children}</Text>
        </Flex>
      ) : null}
      <Triangle
        width={20}
        height={20}
        flip
        slant="down"
        color={theme.colors.white}
        style={styles.BotMessageTail}
      />
      <Image
        width={110}
        style={styles.BotImage_reverse}
        source={vokeImages.VokeBot_Ukelele}
      />
    </Flex>
  ) : type === 'overlay' ? (
    <Flex style={[styles.BotContainer, style]}>
      <Flex style={styles.BotMessage_overlay}>
        {heading ? (
          <Text style={styles.BotHeading_overlay}>{heading}</Text>
        ) : null}
        {children ? (
          <Text style={styles.BotText_reverse}>{children}</Text>
        ) : null}
      </Flex>
      <Triangle
        width={20}
        height={20}
        flip
        slant="down"
        color={theme.colors.white}
        style={styles.BotMessageTail}
      />
      <Image
        width={150}
        style={styles.BotImage_overlay}
        source={vokeImages.vokebot}
      />
    </Flex>
  ) : (
    <Flex style={[styles.BotContainer, style]}>
      <View style={styles.BotInner}>
        <Flex style={styles.BotMessage}>
          {heading ? <Text style={styles.BotHeading}>{heading}</Text> : null}
          {children ? <Text style={styles.BotText}>{children}</Text> : null}
        </Flex>
        <View style={styles.BotCharacter}>
          <Triangle
            width={20}
            height={20}
            flip
            slant="down"
            color={theme.colors.secondary}
            style={styles.BotMessageTail}
          />
          <Image
            width={120}
            style={{
              zIndex: 0,
              marginLeft: -60,
              marginTop: -15,
              marginBottom: -105,
            }}
            source={vokeImages.vokebot}
          />
        </View>
      </View>
    </Flex>
  );

export default BotTalking;
