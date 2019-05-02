import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import Analytics from '../../utils/analytics';
import { navigatePush } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import StatusBar from '../../components/StatusBar';
import theme from '../../theme';
import NotificationToast from '../NotificationToast';
import AdventuresFind from '../AdventuresFind';
import AdventuresMine from '../AdventuresMine';
import st from '../../st';
import { getConversations } from '../../actions/messages';

class Adventures extends Component {
  componentDidMount() {
    const { dispatch, me, navigation } = this.props;
    Analytics.screen(Analytics.s.AdventuresTab);
    Analytics.screen(Analytics.s.AdventuresTabMine);
    if (!me.first_name) {
      dispatch(navigatePush('voke.TryItNowName'));
    }
    // Make sure to call this when this tab mounts to get the badge count
    dispatch(getConversations());

    if (
      navigation &&
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.tabName
    ) {
      navigation.navigate(navigation.state.params.tabName);
      if (navigation.state.params.navTo) {
        dispatch(
          navigatePush(
            navigation.state.params.navTo.routName,
            navigation.state.params.navTo.params,
          ),
        );
      }
    }
  }

  onChangeTab = ({ i }) => {
    if (i === 0) {
      Analytics.screen(Analytics.s.AdventuresTabMine);
    } else if (i === 1) {
      Analytics.screen(Analytics.s.AdventuresTabFind);
    }
  };

  render() {
    const { t, dispatch, myJourneys, index } = this.props;
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
          title={t('title.adventures')}
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
          initialPage={
            index !== undefined
              ? index
              : myJourneys && myJourneys.length > 0 ? 0 : 1
          }
        >
          <View tabLabel={t('title.myAdventures')} style={[st.f1]}>
            <AdventuresMine />
          </View>
          <View tabLabel={t('title.findAdventures')} style={[st.f1]}>
            <AdventuresFind />
          </View>
        </ScrollableTabView>
        <ApiLoading />
      </View>
    );
  }
}

Adventures.propTypes = {};

const mapStateToProps = ({ auth, journeys }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  isAnonUser: auth.isAnonUser, // Need this for the Android PopupMenu to determine which menu options to show
  myJourneys: journeys.mine,
});

export default translate()(connect(mapStateToProps)(Adventures));
