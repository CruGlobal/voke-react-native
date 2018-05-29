import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

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

  handleRefresh = () => {
    LOG('refreshing');
  }

  scrollTo = (y) => {
    this.scrollView.scrollTo({ y, animated: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? undefined : (
              <HeaderIcon
                image={vokeIcons['menu']}
                onPress={() => this.props.navigatePush('voke.Menu')} />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu
                actions={navMenuOptions(this.props)}
              />
            ) : null
          }
          title="Adventure"
        />
        <ScrollView
          ref={(c) => this.scrollView = c}
          bounces={false}
        >
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
  user: auth.user,
});

export default connect(mapStateToProps, nav)(Adventures);
