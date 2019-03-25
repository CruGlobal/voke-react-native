import React, { Component } from 'react';
import { KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import { Flex, Text, Button } from '../../components/common';
import st from '../../st';

class JourneyStepDetail extends Component {
  state = { text: '' };

  componentDidMount() {
    Analytics.screen(Analytics.s.JourneyStepDetail);
  }

  changeText = t => this.setState({ text: t });

  skip = () => {
    console.log('skip');
  };

  render() {
    const { item, me } = this.props;
    const { text } = this.state;

    return (
      <ScrollView
        style={[st.f1, st.bgBlue]}
        contentContainerStyle={{ minHeight: 700 }}
      >
        <Flex style={[st.bgDarkBlue, st.ph1, st.pv4]}>
          <Text style={[st.fs4]}>
            You are making progress {me.first_name}! I see you are getting hang
            of it!
          </Text>
        </Flex>
        <Flex value={1} align="center" style={[st.bgBlue]}>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              direction="column"
              style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd2]}
              align="center"
              justify="center"
            >
              <Text style={[st.tac, st.fs2]}>{item.name}</Text>
            </Flex>
            <Flex
              direction="row"
              style={[st.bgWhite, st.w100, st.pd4, st.brbl5, st.brbr5]}
            >
              <TextInput
                autoCapitalize="sentences"
                returnKeyType="done"
                multiline={true}
                blurOnSubmit={true}
                placeholder="Your Answer..."
                placeholderTextColor={st.grey}
                style={[st.f1, st.fs4, st.darkBlue]}
                underlineColorAndroid={st.colors.transparent}
                selectionColor={st.colors.darkBlue}
                value={text}
                onChangeText={this.changeText}
              />
              {!text ? (
                <Button
                  type="transparent"
                  onPress={this.skip}
                  text="SKIP"
                  buttonTextStyle={[st.orange, st.bold, st.fs3, st.ls2]}
                />
              ) : null}
            </Flex>
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <Text style={[st.fs6, st.tar]}>9:20 PM</Text>
          </Flex>
          <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
            <Flex
              direction="column"
              style={[st.w100, st.bgDarkBlue, st.br5, st.pd5]}
            >
              <Text style={[st.fs4]}>{item.name}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" style={[st.w80]}>
            <Text style={[st.fs6]}>9:20 PM</Text>
          </Flex>
        </Flex>
      </ScrollView>
    );
  }
}

JourneyStepDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  me: auth.user,
});

export default translate('journey')(
  connect(mapStateToProps)(JourneyStepDetail),
);
