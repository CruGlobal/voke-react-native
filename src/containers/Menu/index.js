import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { navMenuOptions } from '../../utils/menu';
import { navigateBack } from '../../actions/nav';
import SettingsList from '../../components/SettingsList';
import { Button } from '../../components/common';
import Header from '../Header';

class Menu extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.Menu);
  }

  render() {
    const { t, dispatch } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            <Button
              type="transparent"
              text={t('done')}
              buttonTextStyle={{ padding: 10, fontSize: 16 }}
              onPress={() => dispatch(navigateBack())}
            />
          }
          title={t('settings')}
          light={true}
        />
        <SettingsList items={navMenuOptions(this.props)} />
      </View>
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isAnonUser: auth.isAnonUser,
  user: auth.user,
});

export default translate()(connect(mapStateToProps)(Menu));
