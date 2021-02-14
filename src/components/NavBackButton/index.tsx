import React, { ReactElement } from 'react';
import { View } from 'react-native';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Touchable from 'components/Touchable';

import styles from './styles';

interface NavBackButton {
  onPress: () => void;
  testID?: string;
  icon?: string;
}

const NavBackButton = ({
  onPress,
  testID,
  icon = 'arrow',
}: NavBackButton): ReactElement => (
  <Flex value={1} justify="center" testID={testID}>
    <Touchable style={styles.touchable} onPress={onPress} testID="ctaGoBack">
      {icon === 'arrow' ? (
        <View style={styles.backIconContainer}>
          <VokeIcon name="chevron-back-outline" style={styles.backIcon} />
        </View>
      ) : (
        <VokeIcon name="menu" style={styles.menuIcon} testID={'iconMenu'} />
      )}
    </Touchable>
  </Flex>
);

export default NavBackButton;
