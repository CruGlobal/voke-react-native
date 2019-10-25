import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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
import { Text } from '../../components/common';

class Notifications extends Component {
  componentDidMount() {
    const { dispatch, me } = this.props;
    Analytics.screen(Analytics.s.AdventuresTab);
    Analytics.screen(Analytics.s.AdventuresTabMine);
    if (!me.first_name) {
      dispatch(navigatePush('voke.TryItNowName'));
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
    const { t, dispatch } = this.props;
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
          title={t('title.notifications')}
          shadow={false}
        />
        <NotificationToast />
        <View>
          <Text>Coming Soon</Text>
        </View>
        <ApiLoading showMS={15000} />
      </View>
    );
  }
}

Notifications.propTypes = {};

const mapStateToProps = ({ auth, journeys }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  isAnonUser: auth.isAnonUser, // Need this for the Android PopupMenu to determine which menu options to show
  myJourneys: journeys.mine,
  invites: journeys.invites,
});

export default translate()(connect(mapStateToProps)(Notifications));
