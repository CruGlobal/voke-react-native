import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import { createMyJourney } from '../../actions/journeys';
import st from '../../st';

class OrgJourneyDetail extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.OrgJourneyDetail);
  }
  myself = async () => {
    const { dispatch, item } = this.props;
    // TODO: Go to the new journey page
    await dispatch(createMyJourney({ organization_journey_id: item.id }));
  };
  friend = () => {
    console.log('with a friend');
  };
  render() {
    const { item } = this.props;

    return (
      <Flex value={1} style={[st.bgWhite]}>
        <Flex style={styles.mainContent}>
          <Text style={styles.header}>{item.name}</Text>
          <Text style={styles.series}>8-part Series</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Flex>
        <Flex value={1} justify="end">
          <View style={styles.triangle} />
          <Flex style={styles.card} align="center" justify="center">
            <Text style={styles.start}>Start the {item.name}</Text>
            <Flex direction="row" justify="center" style={[st.w100]}>
              <Flex value={1} style={[st.ml3]}>
                <Button
                  text="By Myself"
                  onPress={this.myself}
                  style={[
                    st.bgOrange,
                    st.ph3,
                    st.bw0,
                    st.br0,
                    st.brtl3,
                    st.brbl3,
                    st.aic,
                    st.h(48),
                    { marginRight: 1 },
                  ]}
                />
              </Flex>
              <Flex value={1} style={[st.mr3]}>
                <Button
                  text="With a Friend"
                  onPress={this.friend}
                  style={[
                    st.bgOrange,
                    st.ph3,
                    st.bw0,
                    st.br0,
                    st.brtr3,
                    st.aic,
                    st.h(48),
                    st.brbr3,
                  ]}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

OrgJourneyDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('journey')(connect(mapStateToProps)(OrgJourneyDetail));
