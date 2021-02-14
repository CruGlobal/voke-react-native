import React from 'react';
import { useNavigation } from '@react-navigation/native';
import theme from 'utils/theme';
import { StyleSheet } from 'react-native';
import VokeIcon from 'components/VokeIcon';

function BackButton({ isClose = false, size, onPress, style }) {
  const navigation = useNavigation();

  return (
    <VokeIcon
      name={isClose ? 'close' : 'chevron-back-outline'}
      style={styles.backButton}
      size={size || 21}
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          // Get the index of the route to see if we can go back.
          const { index } = navigation.dangerouslyGetState();
          if (index > 0) {
            navigation.goBack();
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoggedInApp' }],
            });
          }
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: theme.spacing.l,
    marginLeft: theme.spacing.l,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'rgba(255,255,255,0.7)',
    padding: 6,
    borderRadius: 99,
    position: 'absolute',
  },
});

export default BackButton;
