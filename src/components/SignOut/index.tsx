import React from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import theme from 'utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Flex from 'components/Flex';

import OldButton from '../OldButton';
import { logoutAction } from '../../actions/auth';

/**
 * Our custom button component.
 */
const SignOut = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const email = useSelector(({ auth }: any) => auth?.user?.email);

  return (
    <>
      {!!email && (
        <OldButton
          isAndroidOpacity={true}
          onPress={() =>
            dispatch(logoutAction()).then(() => {
              // Navigate back to the very first screen.
              // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
              setTimeout(() => {
                navigation.reset({
                  index: 1,
                  routes: [{ name: 'Welcome' }],
                });
              }, 10);
            })
          }
          testID={'ctaSignOut'}
        >
          <Flex direction="row" align="center" justify="center">
            <Text
              style={{
                padding: theme.spacing.m,
                color: theme.colors.white,
                fontSize: theme.fontSizes.l,
                paddingTop: 12,
              }}
            >
              {t('signOut')}
            </Text>
          </Flex>
        </OldButton>
      )}
    </>
  );
};
export default SignOut;
