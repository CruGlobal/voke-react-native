import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/Button';

import theme from '../../theme';
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import styles from './styles';
import { useTranslation } from 'react-i18next';

function CollapsibleInfo({
  toggleText,
  infoText,
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
  ...rest
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Flex
      direction="column"
      justify="center"
      style={styles.container}
    >
      {/* Information Icon */}
      <Button onPress={() => setIsOpen(!isOpen)} testID={'ctaInfoBlockToggle'} style={styles.ctaInfoBlockToggle}>
        <Text style={styles.ctaInfoBlockToggleText} testID={'textHaveCode'}>{toggleText}</Text>
        <VokeIcon
          name="help-circle"
          size={30}
          style={{ marginLeft: theme.spacing.s, color: theme.colors.white }}
        />
      </Button>
      {/* Content */}
      {isOpen ? (
        <Flex>
          <Text
            style={styles.textMain}
          >
            {infoText}
          </Text>
          {children}
        </Flex>
      ) : null}
    </Flex>
  );
}

export default CollapsibleInfo;
