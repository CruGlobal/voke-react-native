import React, { ReactElement, useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
type Props = {
  size?: 's' | 'm' | 'l';
  [x: string]: any;
};

import theme from '../../theme';

const Spacer = ({
  size = 'm',
  ...rest
}: Props): React.ReactElement => {
  return (
    <View
      style={{
        minHeight: theme.spacing[size]
      }}
    />
  );
}

export default Spacer;
