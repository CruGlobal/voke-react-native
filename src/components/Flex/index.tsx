import React, { forwardRef } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

type FlexProps = {
  value?: number;
  direction?: string;
  align?: string;
  justify?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
  self?: string;
  grow?: number;
  wrap?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
};

// const Flex = React.forwardRef<Ref, FlexProps>(( props:FlexProps, ref) => {
// Passing reference disabled for now.
// see https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/README.md#forwardrefcreateref
const Flex = (props: FlexProps) => {
  const {
    value,
    direction,
    align,
    justify,
    self: flexSelf,
    grow,
    wrap,
    children,
    style = {},
    ...rest
  } = props;

  const styleObj: any = {};
  if (value) styleObj.flex = value;
  if (direction) styleObj.flexDirection = direction;
  if (wrap) styleObj.flexWrap = wrap;
  if (grow) styleObj.flexGrow = grow;

  if (align) {
    if (align === 'center') styleObj.alignItems = 'center';
    else if (align === 'start') styleObj.alignItems = 'flex-start';
    else if (align === 'end') styleObj.alignItems = 'flex-end';
    else if (align === 'stretch') styleObj.alignItems = 'stretch';
  }
  if (flexSelf) {
    if (flexSelf === 'center') styleObj.alignSelf = 'center';
    else if (flexSelf === 'start') styleObj.alignSelf = 'flex-start';
    else if (flexSelf === 'end') styleObj.alignSelf = 'flex-end';
    else if (flexSelf === 'stretch') styleObj.alignSelf = 'stretch';
  }
  if (justify) {
    if (justify === 'center') styleObj.justifyContent = 'center';
    else if (justify === 'start') styleObj.justifyContent = 'flex-start';
    else if (justify === 'end') styleObj.justifyContent = 'flex-end';
    else if (justify === 'around') styleObj.justifyContent = 'space-around';
    else if (justify === 'between') styleObj.justifyContent = 'space-between';
    else if (justify === 'evenly') styleObj.justifyContent = 'space-evenly';
  }
  return (
    <View
      // ref={ref}
      {...rest}
      style={[style, styleObj]}
    >
      {children}
    </View>
  );
};
Flex.displayName = 'Flex';

export default Flex;
