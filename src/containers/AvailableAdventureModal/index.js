import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';

function AvailableAdventureModal(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isLandscape, setIsLandscape] = useState(false);
  const { item, alreadyStartedByMe } = props.route.params;
  return (
    <Flex value={1}>
      <Video
        onOrientationChange={orientation =>
          orientation === 'portrait'
            ? setIsLandscape(false)
            : setIsLandscape(true)
        }
        item={item.item.content}
      />
      {isLandscape ? null : (
        <ScrollView
          bounces={false}
          style={[st.bgBlue, { paddingBottom: insets.bottom }]}
        >
          <Flex style={[st.pd3, st.bgWhite]}>
            <Text style={[st.fs2, st.blue]}>{item.name}</Text>
            <Text style={[st.pt5, st.charcoal]}>
              {item.total_steps}-{'part series'}
            </Text>
            <Text style={[st.charcoal, st.pv4]}>{item.description}</Text>
          </Flex>
          <Flex justify="end" style={[st.bgWhite]}>
            <Triangle width={st.fullWidth} height={80} color={st.colors.blue} />
            <Flex style={[st.bgBlue, st.pv4]} align="center" justify="center">
              <Text style={[st.fs3, st.white, st.pb5]}>
                {'Start this Adventure'}
              </Text>
              <Flex direction="row" justify="center" style={[st.w100]}>
                <Flex value={1} align="center" style={[]}>
                  <Button
                    isAndroidOpacity={true}
                    style={[
                      st.pd4,
                      st.br1,
                      st.bgOrange,
                      st.w(st.fullWidth - 50),
                    ]}
                    onPress={() =>
                      navigation.navigate('StartAdventureModal', {
                        item,
                        alreadyStartedByMe,
                      })
                    }
                  >
                    <Flex direction="row" align="center" justify="center">
                      <Text style={[st.white, st.fs20]}>Start</Text>
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      )}
    </Flex>
  );
}

export default AvailableAdventureModal;
