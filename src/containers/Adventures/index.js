import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import StatusBar from '../../components/StatusBar';
import AdventureMap from '../AdventureMap';
import theme from '../../theme';

class Adventures extends Component {
  state = { refreshing: false };

  componentDidMount() {
    Analytics.screen('Adventures');
  }

  scrollTo = y => {
    if (y === 'end') {
      this.scrollView.scrollToEnd();
    } else {
      this.scrollView.scrollTo({ y, animated: true });
    }
  };

  render() {
    const { t, navigatePush } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? (
              undefined
            ) : (
              <HeaderIcon
                image={vokeIcons['menu']}
                onPress={() => navigatePush('voke.Menu')}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu actions={navMenuOptions(this.props)} />
            ) : null
          }
          title={t('title.adventure')}
        />
        <ScrollView ref={c => (this.scrollView = c)} bounces={false}>
          <AdventureMap scrollTo={this.scrollTo} />
        </ScrollView>
        <ApiLoading />
      </View>
    );
  }
}

Adventures.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  me: auth.user,
  isAnonUser: auth.isAnonUser, // Need this for the Android PopupMenu to determine which menu options to show
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(Adventures),
);
