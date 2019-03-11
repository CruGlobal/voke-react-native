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
import AdventuresFind from '../AdventuresFind';
import AdventuresMine from '../AdventuresMine';

class Adventures extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.AdventuresTab);
    Analytics.screen(Analytics.s.AdventuresTabMine);
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
          title={t('title.adventures')}
        />
        <ScrollableTabView
          tabBarUnderlineStyle={{ backgroundColor: theme.white, height: 2 }}
          tabBarBackgroundColor={theme.secondaryColor}
          tabBarActiveTextColor={theme.white}
          tabBarInactiveTextColor={theme.primaryColor}
          tabBarTextStyle={{ fontWeight: 'normal' }}
        >
          <View tabLabel={t('title.myAdventures')} style={{ flex: 1 }}>
            <AdventuresMine />
          </View>
          <View tabLabel={t('title.findAdventures')} style={{ flex: 1 }}>
            <AdventuresFind />
          </View>
        </ScrollableTabView>
        <ApiLoading />
      </View>
    );
  }
}

Adventures.propTypes = {};

const mapStateToProps = ({ auth }) => ({
  me: auth.user,
  isAnonUser: auth.isAnonUser, // Need this for the Android PopupMenu to determine which menu options to show
});

export default translate()(connect(mapStateToProps)(Adventures));
