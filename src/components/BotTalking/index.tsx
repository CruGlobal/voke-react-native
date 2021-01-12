import React from 'react';
import Image from 'react-native-scalable-image';
import theme from 'utils/theme';
import { View } from 'react-native';
import { bots } from 'assets';

import Flex from '../Flex';
import Text from '../Text';
import Triangle from '../Triangle';

import styles from './styles';

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
}: IBotTalking): React.ReactElement => {
  switch (type) {
    case 'uke':
      return (
        <Flex style={[styles.BotContainer, style]}>
          {children ? (
            <Flex style={styles.BotMessage_uke}>
              <Text style={styles.BotText_uke}>{children}</Text>
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
          <Image width={164} style={styles.BotImage_uke} source={bots.uke} />
        </Flex>
      );
    case 'overlay':
      return (
        <Flex style={[styles.BotContainer, style]}>
          <View style={styles.BotInner}>
            <Flex style={styles.BotOverlayMessage}>
              {heading ? (
                <Text style={styles.BotOverlayHeading}>{heading}</Text>
              ) : null}
              {children ? (
                <Text style={styles.BotOverlayText}>{children}</Text>
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
              source={bots.bot}
            />
          </View>
        </Flex>
      );
    default:
      return (
        <Flex style={[styles.BotContainer, style]}>
          <View style={styles.BotInner}>
            <Flex style={styles.BotMessage}>
              {heading ? (
                <Text style={styles.BotHeading}>{heading}</Text>
              ) : null}
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
                source={type === 'sad' ? bots.sad : bots.bot}
              />
            </View>
          </View>
        </Flex>
      );
  }
};

export default BotTalking;
