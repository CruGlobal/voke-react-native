import React, { useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import { View, Linking, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount } from '../../utils';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';
import CONSTANTS from '../../constants';

import CAROUSEL_1 from '../../assets/carousel1.png';
import CAROUSEL_2 from '../../assets/carousel2.png';
import CAROUSEL_3 from '../../assets/carousel3.png';

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

type CarouselProps = {
  item: {
    title: string,
    description: string,
    image: string,
  },
  index: number,
}
const CarouselItem = ({ item, index }:CarouselProps) => {
  return (
    <Flex
      direction="column"
      value={1}
      align="center"
      justify="start"
      style={{
        paddingTop:styles.spacing.xl,
        paddingHorizontal:styles.spacing.m
      }}
    >
      <Text style={styles.SliderTitle}>
        {item.title}
      </Text>
      <Text style={styles.SliderDescription}>
        {item.description}
      </Text>
      {/* TODO: Recreate images to be square, hi-res, and same size  */}
      <Image
        source={item.image}
        resizeMode="contain"
        style={{
          width: useWindowDimensions().width - styles.spacing.m * 2,
          // height: useWindowDimensions().height / 3,
        }}
      />
    </Flex>
  );
};

type WelcomeProps = {
  props: any
}
const Welcome = ( props: WelcomeProps  ) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  useMount(() => {
    Orientation.lockToPortrait();
  });

  return (
    <Flex
      value={1}
      style={[
        styles.SectionOnboarding,
        { paddingTop: insets.top }
      ]}
    >
      <StatusBar />
      <Carousel
        data={CAROUSEL_CARDS}
        renderItem={props => <CarouselItem {...props} />}
        sliderWidth={useWindowDimensions().width}
        itemWidth={useWindowDimensions().width}
        onSnapToItem={index => setActiveSlide(index)}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
        autoplay={true}
      />
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        dotColor={styles.colors.white}
        inactiveDotColor={'rgba(255,255,255,0.7)'}
        dotStyle={styles.dotStyle}
        inactiveDotScale={0.8}
      />
      {/* SECTION: CALL TO ACTION BUTTON */}
      <Flex value={1}>
        <Triangle
          width={useWindowDimensions().width}
          height={40}
          color={styles.colors.darkBlue}
        />
        <Flex
          direction="column"
          style={[styles.SectionAction]}
          value={1}
          justify="evenly"
        >
          {/* BUTTON: CALL TO ACTION */}
          <Button
            isAndroidOpacity={true}
            style={styles.ButtonStart}
            onPress={() => navigation.navigate('CreateName')}
          >
            <Text style={styles.ButtonStartLabel}>Start Exploring</Text>
          </Button>
          {/* TEXT: TERMS OF SERVICE */}
          <Text style={[styles.TextSmall,{textAlign:'center'}]}>
            By exploring, you agree to our{"\n"}
            <Text
              style={styles.Link}
              onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
            >
              Privacy Policy
            </Text>
            &nbsp; and &nbsp;
            <Text
              style={styles.Link}
              onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
            >
              Terms of Service
            </Text>
          </Text>
        </Flex>
      </Flex>
      {/* SECTION: SIGN IN */}
      <Flex
        // value={1}
        direction="row"
        align="center"
        justify="center"
        style={styles.SectionSignIn}
        // width={useWindowDimensions().width}
      >
        <View>
          <Text style={styles.SignInText}>
            Already have an account?
          </Text>
        </View>
        <Button
          isAndroidOpacity={true}
          style={[styles.ButtonSignIn, {marginLeft:20}]}
          onPress={() => {
            navigation.navigate('SignInModal');
            // navigation.navigate('SignInModal', { shouldMerge: true })
          }}
        >
          <Text style={styles.ButtonSignInLabel}>Sign In</Text>
        </Button>
      </Flex>
      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: styles.colors.darkBlue,
          paddingBottom: insets.bottom
        }}
      ></Flex>
    </Flex>
  );
}

export default Welcome;
