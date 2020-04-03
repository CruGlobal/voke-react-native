import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-picker';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { createAccount, updateMe } from '../../actions/auth';
import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';

const imagePickerOptions = {
  title: 'Select Avatar',
  maxWidth: 500, // photos only
  maxHeight: 500, // photos only
  allowsEditing: true,
  noData: true,
  mediaType: 'photo',
  cameraType: 'back',
};

function CreateProfilePhoto({ route }) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const { firstName, lastName, hasAccount } = route.params;
  async function handleContinue() {
    const avatarData = {
      avatar: {
        fileName: `${firstName}_${lastName}.png`,
        uri: avatarSource,
      },
    };
    const userData = {
      first_name: firstName,
      last_name: lastName,
    };
    try {
      setLoginLoading(true);
      if (hasAccount) {
        if (!avatarSource) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Adventures' }],
          });
        } else {
          await dispatch(updateMe(avatarData));
          navigation.reset({ index: 0, routes: [{ name: 'Adventures' }] });
        }
      } else {
        await dispatch(
          createAccount(userData, avatarSource ? avatarData : null),
        );
      }
    } finally {
      setLoginLoading(false);
    }
  }

  function handleSelectImage() {
    ImagePicker.showImagePicker(imagePickerOptions, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
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
      <StatusBar />
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        <Flex direction="row" justify="between">
          {hasAccount ? (
            <Flex />
          ) : (
            <Touchable
              style={[st.p5, st.pl4, st.mb3]}
              onPress={() => navigation.goBack()}
            >
              <VokeIcon
                type="image"
                name="buttonArrow"
                style={[st.rotate('180deg'), st.h(22), st.w(22)]}
              />
            </Touchable>
          )}
          <Touchable style={[st.p5, st.pl4, st.mb3]} onPress={handleContinue}>
            <Text style={[st.white, st.fs16, st.pr5]}>Skip</Text>
          </Touchable>
        </Flex>
        <Flex direction="column" self="stretch" align="center">
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.h(180)]}
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
                  Add a photo so your friends can recognize you
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
                st.bgOffBlue,
                { borderRadius: st.fullWidth / 1.8 },
              ]}
            >
              {!avatarSource ? (
                <VokeIcon
                  type="image"
                  name="camera"
                  style={[st.w(70), st.h(70)]}
                />
              ) : (
                <Image
                  source={avatarSource}
                  style={[
                    st.w(st.fullWidth / 1.8),
                    st.h(st.fullWidth / 1.8),
                    { borderRadius: st.fullWidth / 1.8 },
                  ]}
                />
              )}
            </Flex>
          </Touchable>
        </Flex>
        <Flex value={1} />
        <Button
          onPress={handleContinue}
          touchableStyle={[
            st.w100,
            st.bgDarkBlue,
            st.p4,
            { paddingBottom: insets.bottom },
          ]}
          isLoading={loginLoading}
        >
          <Text style={[st.white, st.fs20, st.tac]}>Continue</Text>
        </Button>
      </Flex>
    </Flex>
  );
}

export default CreateProfilePhoto;
