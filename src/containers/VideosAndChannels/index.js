import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { navigatePush } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import StatusBar from '../../components/StatusBar';
import theme from '../../theme';
import NotificationToast from '../NotificationToast';
import st from '../../st';
import Videos from '../Videos';
import Channels from '../Channels';

class VideosAndChannels extends Component {
  render() {
    const { t, dispatch, index } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? (
              undefined
            ) : (
              <HeaderIcon
                icon="menu"
                onPress={() => dispatch(navigatePush('voke.Menu'))}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu actions={navMenuOptions(this.props)} />
            ) : (
              undefined
            )
          }
          title={t('title.videos')}
          shadow={false}
        />
        <NotificationToast />

        <ScrollableTabView
          tabBarUnderlineStyle={[st.bgWhite, st.h(2)]}
          tabBarBackgroundColor={theme.secondaryColor}
          tabBarActiveTextColor={theme.white}
          tabBarInactiveTextColor={theme.primaryColor}
          tabBarTextStyle={[st.normal]}
          prerenderingSiblingsNumber={Infinity}
          initialPage={index !== undefined ? index : 0}
        >
          <View tabLabel={t('title.videos')} style={[st.f1]}>
            <Videos />
          </View>
          <View tabLabel={t('title.channels')} style={[st.f1]}>
            <Channels />
          </View>
        </ScrollableTabView>
        <ApiLoading showMS={15000} />
      </View>
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate()(connect(mapStateToProps)(VideosAndChannels));
