import React, { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import theme from 'utils/theme';
import st from 'utils/st'; // TODO: use new styles here.
import Flex from 'components/Flex';
import Text from 'components/Text';

// TextInputProps already have all the property definitions used here,
// so just extend it with our one custom property 'label'.
interface CustomProps extends TextInputProps {
  label: string;
  error?: string;
}

const TextField = forwardRef(
  // TODO: try to find an appropriate type for ref: any?
  (
    { label, placeholder, value = '', error, ...restProps }: CustomProps,
    ref: any,
  ) => {
    const [focused, setFocused] = useState(false);

    const flexibleFontSize = () => {
      if (value.length < 20) {
        return theme.fontSizes.xxl;
      } else if (value.length < 29) {
        return theme.fontSizes.xl;
      } else {
        return theme.fontSizes.l;
      }
    };

    return (
      <Flex direction="column" self="stretch" align="center">
        <Text
          style={[
            st.fs16,
            {
              fontSize: theme.fontSizes.l,
              color: theme.colors.secondary,
              minHeight: 26,
            },
          ]}
        >
          {focused || value ? label : ''}
        </Text>
        <TextInput
          ref={ref}
          style={[
            st.w100,
            st.tac,
            {
              backgroundColor: theme.colors.transparent,
              borderBottomWidth: 1,
              borderBottomColor: focused
                ? theme.colors.white
                : theme.colors.secondaryAlt,
              margin: 5,
              marginBottom: 0,
              height: 50,
              color: theme.colors.white,
              fontSize: flexibleFontSize(),
            },
            // st.bbOffBlue,
            // st.bbw1,
            st.fontFamilyMain,
          ]}
          underlineColorAndroid={theme.colors.transparent}
          placeholderTextColor={theme.colors.white}
          autoCapitalize={
            restProps.autoCapitalize ? restProps.autoCapitalize : 'words'
          }
          spellCheck={false}
          keyboardAppearance="dark"
          selectionColor={theme.colors.white}
          returnKeyType={
            restProps.returnKeyType ? restProps.returnKeyType : 'done'
          }
          onFocus={() => {
            setFocused(true);
          }}
          onEndEditing={() => {
            setFocused(false);
          }}
          placeholder={focused ? '' : placeholder}
          value={value}
          {...restProps}
        />
        <View
          style={{
            width: '100%',
            minHeight: 26,
          }}
        >
          <Text
            style={{
              color: theme.colors.red,
              paddingTop: 2,
              fontSize: theme.fontSizes.s,
              alignSelf: 'center',
            }}
          >
            {error}
          </Text>
        </View>
      </Flex>
    );
  },
);

export default TextField;
