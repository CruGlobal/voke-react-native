import React, { useState, useRef, useEffect } from 'react';
import theme from 'utils/theme';
import { useTranslation } from 'react-i18next';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';

import OldButton from '../OldButton';

import styles from './styles';

function CollapsibleInfo({
  toggleText,
  infoText,
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
  ...rest
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Flex direction="column" justify="center" style={styles.container}>
      {/* Information Icon */}
      <OldButton
        onPress={() => setIsOpen(!isOpen)}
        testID={'ctaInfoBlockToggle'}
        style={styles.ctaInfoBlockToggle}
      >
        <Text style={styles.ctaInfoBlockToggleText} testID={'textHaveCode'}>
          {toggleText}
        </Text>
        <VokeIcon
          name="help-circle"
          size={30}
          style={{ marginLeft: theme.spacing.s, color: theme.colors.white }}
        />
      </OldButton>
      {/* Content */}
      {isOpen ? (
        <Flex>
          <Text style={styles.textMain}>{infoText}</Text>
          {children}
        </Flex>
      ) : null}
    </Flex>
  );
}

export default CollapsibleInfo;
