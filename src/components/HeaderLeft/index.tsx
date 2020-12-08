import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import NavBackButton from 'components/NavBackButton';

interface HeaderLeftProps {
  resetTo?: string;
  testID?: string;
}

const HeaderLeft = ({ resetTo, testID }: HeaderLeftProps): ReactElement => {
  const navigation = useNavigation();

  const goBack = (): void => {
    const { index, routes } = navigation.dangerouslyGetState();
    if (resetTo) {
      if (
        index > 0 &&
        routes.length &&
        routes[routes.length - 2]?.name === resetTo
      ) {
        // .goBack is 2s. faster than .reset(), so if possible use it.
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          type: 'stack', // Required to make dynamic nav bar to work properly.
          routes: [{ name: resetTo }],
        });
      }
    } else if (resetTo === 'Menu') {
      navigation.navigate('Menu');
    } else {
      // Get the index of the route to see if we can go back.
      if (index > 0) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          type: 'stack', // Required to make dynamic nav bar to work properly.
          routes: [{ name: 'LoggedInApp' }],
        });
      }
    }
  };

  return (
    <NavBackButton
      onPress={goBack}
      testID={testID}
      icon={resetTo === 'Menu' ? 'menu' : 'arrow'}
    />
  );
};

export default HeaderLeft;
