import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';

import { navigateAction } from '../../actions/navigation';

function VideosButton({ dispatch }) {
  return (
    <Button
      icon="video-library"
      iconStyle={{fontSize: 30}}
      type="header"
      style={{ paddingRight: 10 }}
      onPress={() => dispatch(navigateAction('Videos'))}
    />
  );
}

export default connect()(VideosButton);
