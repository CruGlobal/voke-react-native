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
import { Text } from '../../components/common';

class Adventures extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.AdventuresTab);
  }

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
          title={t('title.adventure')}
        />
        <Text>Adventures!</Text>
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
