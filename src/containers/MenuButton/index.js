import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';

import { navigateAction } from '../../actions/navigation';

function MenuButton({ dispatch }) {
  return (
    <Button
      icon="menu"
      iconStyle={{fontSize: 30}}
      type="header"
      style={{ paddingLeft: 10 }}
      onPress={() => dispatch(navigateAction('Menu'))}
    />
  );
}

export default connect()(MenuButton);
