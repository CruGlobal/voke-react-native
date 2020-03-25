import React, { useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { Linking } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as CONSTANTS from '../../constants';
import Triangle from '../../components/Triangle';

import CAROUSEL_1 from '../../assets/carousel1.png';
import CAROUSEL_2 from '../../assets/carousel2.png';
import CAROUSEL_3 from '../../assets/carousel3.png';
import { useMount } from '../../utils';

const CAROUSEL_CARDS = [
  {
    title: 'Start an Adventure',
    description: 'Explore videos about Faith and other topics.',
    image: CAROUSEL_1,
  },
  {
    title: 'Join in with Friends',
    description:
      ' Choose your Adventure then share your 6-digit Adventure Code to add people to your Voke Group in seconds.',
    image: CAROUSEL_2,
  },
  {
    title: 'Talk about it',
    description:
      'Message each other in real-time, chat about what you just watched— just as if you were in the room together.',
    image: CAROUSEL_3,
  },
];

const CarouselItem = ({ item, index }) => {
  return (
    <Flex
      direction="column"
      style={[st.pt1]}
      value={1}
      align="center"
      justify="start"
    >
      <Text style={[st.fontFamilyMainBold, st.fs24, st.white, st.bold]}>
        {item.title}
      </Text>
      <Text style={[st.pt6, st.fs16, st.white, st.tac, st.ph2]}>
        {item.description}
      </Text>
      <Image
        source={item.image}
        resizeMode="contain"
        style={[st.w(st.fullWidth - 30), st.h(st.fullHeight / 3)]}
      />
    </Flex>
  );
};

function Welcome(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  useMount(() => {
    Orientation.lockToPortrait();
  });

  return (
    <Flex value={1} style={[st.bgBlue, { paddingTop: insets.top }]}>
      <StatusBar />

      <Carousel
        data={CAROUSEL_CARDS}
        renderItem={props => <CarouselItem {...props} />}
        sliderWidth={st.fullWidth}
        itemWidth={st.fullWidth}
        onSnapToItem={index => setActiveSlide(index)}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
        autoplay={true}
      />
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        dotColor={st.colors.white}
        inactiveDotColor={'rgba(255,255,255,0.7)'}
        dotStyle={[st.w(10), st.h(10), st.br1, st.mh0]}
        inactiveDotScale={0.8}
      />

      <Flex value={1} style={[st.transparent]}>
        <Triangle
          width={st.fullWidth}
          height={80}
          color={st.colors.darkBlue}
          // style={[st.abs, { bottom: 400 }]}
        />
        <Flex
          direction="column"
          style={[st.ph2, st.bgDarkBlue]}
          value={4}
          justify="between"
        >
          <Button
            isAndroidOpacity={true}
            style={[st.pd4, st.br5, st.bgBlue]}
            onPress={() => navigation.navigate('CreateName')}
          >
            <Flex direction="row" align="center" justify="center">
              <Text style={[st.white, st.fs20]}>Start Exploring</Text>
            </Flex>
          </Button>
          <Flex direction="column">
            <Text style={[st.fs12, st.white, st.tac, st.pt4]}>
              By exploring, you agree to our
            </Text>
            <Text style={[st.fs12, st.white, st.tac]}>
              <Text
                style={[st.underline, st.white, st.fs12]}
                onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
              >
                Privacy Policy
              </Text>
              &nbsp; and &nbsp;
              <Text
                style={[st.underline, st.white, st.fs12]}
                onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
              >
                Terms of Service
              </Text>
            </Text>
          </Flex>
          <Flex direction="row" align="center" justify="center">
            <Text style={[st.white, st.fs16, st.pr3]}>
              Already have an account?
            </Text>
            <Button
              isAndroidOpacity={true}
              style={[
                st.pd6,
                st.ph4,
                st.br5,
                st.bgTransparent,
                st.bw1,
                st.borderWhite,
              ]}
              onPress={() => {}}
            >
              <Flex direction="row" align="center" justify="center">
                <Text style={[st.white, st.fs16]}>Sign In</Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>

        <Flex
          style={[st.bgDarkBlue, { paddingBottom: insets.bottom }]}
          value={1}
        ></Flex>
      </Flex>
    </Flex>
  );
}

export default Welcome;
