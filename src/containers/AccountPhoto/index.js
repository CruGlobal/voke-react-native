import React, { useState } from 'react';
import ImagePicker from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { updateMe } from '../../actions/auth';

import st from '../../st';
import theme from '../../theme';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import Touchable from '../../components/Touchable';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';

const imagePickerOptions = {
  title: 'Select Avatar',
  maxWidth: 500, // photos only
  maxHeight: 500, // photos only
  allowsEditing: true,
  noData: true,
  mediaType: 'photo',
  cameraType: 'back',
};

function AccountPhoto() {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState(false);
  const userId = useSelector(({ auth }) => auth.user.id);
  // Check if there is custom avatar already defined.
  const initialAvatarUrl = useSelector(({ auth }) => auth.user?.avatar?.medium);
  let currentAvatar = null;
  if (initialAvatarUrl && initialAvatarUrl.includes('/users/avatars/')) {
    currentAvatar = {
      uri: initialAvatarUrl,
    };
  }

  const [avatarSource, setAvatarSource] = useState(currentAvatar);

  async function handleContinue() {
    if (!avatarSource || avatarSource === null) {
      // No image selected - skip to the next screen.

      try {
        navigation.navigate('LoggedInApp', { screen: 'Adventures' });
      } catch (error) {
        navigation.navigate('Adventures');
      }
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
        // navigation.navigate('LoggedInApp', { screen: 'Adventures' }); // LoggedInApp
        try {
          navigation.navigate('LoggedInApp', { screen: 'Adventures' });
        } catch (error) {
          navigation.navigate('Adventures');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error updating me image 4', error);
      }
    }
  }

  function handleSelectImage() {
    ImagePicker.showImagePicker(imagePickerOptions, response => {
      if (response.didCancel) {
        // eslint-disable-next-line no-console
        console.log('User cancelled image picker');
      } else if (response.error) {
        // eslint-disable-next-line no-console
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // eslint-disable-next-line no-console
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setAvatarSource(source);
      }
    });
  }

  return (
    <Flex
      style={[st.aic, st.w100, st.jcsb, st.bgBlue, { paddingTop: insets.top }]}
    >
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        {/* <Flex direction="row" justify="between">
          <Touchable
            style={[st.p5, st.pl4, st.mb3]}
            onPress={() => navigation.navigate('LoggedInApp')}
          >
            <Text style={[st.white, st.fs16, st.pr5]}>Skip</Text>
          </Touchable>
        </Flex> */}
        <Flex direction="column" self="stretch" align="center">
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.h(180), { marginTop: 60 }]}
          >
            <Flex
              direction="column"
              value={1}
              justify="start"
              align="end"
              style={[st.pl1]}
            >
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                <Text style={[st.white, st.fs20, st.tac]}>
                  { avatarSource ?
                  'Looking good? Tap on photo to change or click continue.':
                  'Add a photo so your friends can recognize you'}
                </Text>
              </Flex>
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                style={[st.rotate(120), st.mt(-6)]}
              />
            </Flex>
            <Flex justify="end" self="stretch" style={[]}>
              <Image
                source={VOKE_BOT}
                resizeMode="contain"
                style={[st.w(80), st.h(120)]}
              />
            </Flex>
          </Flex>
          <Touchable onPress={handleSelectImage}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              style={[
                st.w(st.fullWidth / 1.8),
                st.h(st.fullWidth / 1.8),
                { borderRadius: st.fullWidth / 1.8,
                  backgroundColor: theme.colors.secondaryAlt,
                },
              ]}
            >
              {!avatarSource ? (
                <VokeIcon
                  type="image"
                  name="camera"
                  style={[st.w(70), st.h(70)]}
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
        </Flex>
        <Flex value={1} />
        <Button
          onPress={handleContinue}
          touchableStyle={[
            st.w100,
            st.p4,
            {
              backgroundColor: theme.colors.secondary,
            },
          ]}
          isLoading={loginLoading}
        >
          <Text style={[st.white, st.fs20, st.touchableStyle, st.tac]}>Continue</Text>
          <Flex style={{height: insets.bottom}}  />
        </Button>
      </Flex>
    </Flex>
  );
}

export default AccountPhoto;
