import React, { useState } from 'react';
import ImagePicker from 'react-native-image-picker'; // Used for native selector between gallery and cammera.
import ImagePickerWithCrop from 'react-native-image-crop-picker'; // Used for image cropping features.
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Image from 'components/Image';
import OldButton from 'components/OldButton';
import Triangle from 'components/Triangle';
import VokeIcon from 'components/VokeIcon';
import Touchable from 'components/Touchable';
import BotTalking from 'components/BotTalking';
import Screen from 'components/Screen';
import { updateMe } from 'actions/auth';
import { RootStackParamList } from 'utils/types';
import theme from 'utils/theme';
import st from 'utils/st';

type NavigationPropType = StackNavigationProp<
  RootStackParamList,
  'AccountPhoto'
>;

type RoutePropType = RouteProp<RootStackParamList, 'AccountPhoto'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function AccountPhoto(props: Props) {
  const { t } = useTranslation('tryItNow');
  const onComplete = props?.route?.params?.onComplete;
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState(false);
  const userId = useSelector(({ auth }) => auth.user.id);
  const windowDimensions = Dimensions.get('window');
  // Check if there is custom avatar already defined.
  const initialAvatarUrl = useSelector(({ auth }) => auth.user?.avatar?.medium);
  let currentAvatar = null;
  if (initialAvatarUrl && initialAvatarUrl.includes('/users/avatars/')) {
    currentAvatar = {
      uri: initialAvatarUrl,
    };
  }

  const [avatarSource, setAvatarSource] = useState(currentAvatar);

  const nextScreen = (screenName = 'Adventures') => {
    if (onComplete) {
      return onComplete();
    } else {
      try {
        navigation.navigate('LoggedInApp', { screen: screenName });
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedInApp' }],
        });
      } catch (error) {
        navigation.navigate(screenName);
      }
    }
  };

  async function handleContinue() {
    if (
      !avatarSource ||
      avatarSource === null ||
      avatarSource?.uri.includes('vokeapi')
    ) {
      // No image selected - skip to the next screen.

      return nextScreen();
    } else {
      const avatarData = {
        avatar: {
          // fileName: `${firstName}_${lastName}.png`,
          fileName: `${userId}.png`, // Why png not jpeg?
          uri: avatarSource,
        },
      };
      setLoginLoading(true);

      try {
        await dispatch(updateMe(avatarData));
        setLoginLoading(false);
        nextScreen();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error updating me image 4', error);
      }
    }
  }

  const imageTakeCrop = (mode: string): void => {
    const options = {
      width: 500,
      height: 500,
      cropping: true,
      avoidEmptySpaceAroundImage: true,
      cropperToolbarTitle: t('imagePicker:selectOrNew'),
      cropperCircleOverlay: true,
      mediaType: 'photo',
    };
    if (mode === 'camera') {
      ImagePickerWithCrop.openCamera({ ...options, useFrontCamera: true }).then(
        image => {
          setAvatarSource({ uri: image.path });
        },
      );
    } else {
      ImagePickerWithCrop.openPicker({
        ...options,
        smartAlbums: ['SelfPortraits', 'UserLibrary', 'PhotoStream'],
      }).then(image => {
        setAvatarSource({ uri: image.path });
      });
    }
  };

  const handleSelectImage = (): void => {
    ImagePicker.showImagePicker(
      {
        title: t('imagePicker:selectOrNew'),
        maxWidth: 500, // photos only
        maxHeight: 500, // photos only
        // allowsEditing: true,
        noData: true,
        mediaType: 'photo',
        // cameraType: 'back',
        storageOptions: {
          cameraRoll: false,
          privateDirectory: true,
        },

        // Remove default buttons. We use this library it for UI dialog only.
        takePhotoButtonTitle: null,
        chooseFromLibraryButtonTitle: null,
        customButtons: [
          { name: 'camera', title: t('imagePicker:camera') },
          { name: 'gallery', title: t('imagePicker:gallery') },
        ],
      },
      response => {
        if (response.didCancel) {
          // eslint-disable-next-line no-console
          console.log('User cancelled image picker');
        } else if (response.error) {
          // eslint-disable-next-line no-console
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton === 'camera') {
          imageTakeCrop('camera');
        } else if (response.customButton === 'gallery') {
          imageTakeCrop('gallery');
        }
      },
    );
  };

  return (
    <Screen>
      <BotTalking
        heading={t('addPhotoTitle')}
        style={{
          paddingBottom: windowDimensions.height > 600 ? theme.spacing.xxl : 0,
          // Don't set height for bot messages!
          // It should be flexible for every screen.
        }}
      >
        {t('addPhoto')}
      </BotTalking>
      <Flex />
      <Touchable onPress={handleSelectImage}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={[
            st.w(st.fullWidth / 1.8),
            st.h(st.fullWidth / 1.8),
            {
              alignSelf: 'center',

              borderRadius: st.fullWidth / 1.8,
              backgroundColor: theme.colors.secondaryAlt,
            },
          ]}
        >
          {!avatarSource ? (
            <VokeIcon
              name="camera"
              style={{ fontSize: 70, color: theme.colors.white }}
              testID={'iconCamera'}
            />
          ) : (
            <>
              <Image
                source={avatarSource}
                style={[
                  st.w(st.fullWidth / 1.8),
                  st.h(st.fullWidth / 1.8),
                  { borderRadius: st.fullWidth / 1.8 },
                ]}
              />
            </>
          )}
        </Flex>
      </Touchable>
      <OldButton
        onPress={handleContinue}
        touchableStyle={[
          st.pd4,
          st.br1,
          {
            marginTop:
              windowDimensions.height > 800
                ? theme.spacing.xxl
                : theme.spacing.xl,
            backgroundColor: theme.colors.white,
            textAlign: 'center',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            width: '100%',
          },
        ]}
        isLoading={loginLoading}
        testID={'ctaPhotoContinue'}
      >
        <Text style={[st.fs20, st.tac, { color: theme.colors.secondary }]}>
          {avatarSource ? t('next') : t('skip')}
        </Text>
      </OldButton>
    </Screen>
  );
}

export default AccountPhoto;
