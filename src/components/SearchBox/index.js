import React, { useState } from 'react';
import Icon from '../Icon';
import st from '../../st';
import { TextInput } from 'react-native-gesture-handler';

function SearchBox({ source, style, badge, onPress, ...rest }) {
  const [searchText, setSearchText] = useState('');
  return (
    <>
      <TextInput
        style={[
          st.bgTransparent,
          st.mt1,
          st.bbPink,
          st.bw2,
          st.asc,
          st.white,
          st.fs2,
          st.bold,
          st.tac,
          {
            width: st.fullWidth * 0.85,
            fontFamily: st.fontFamilyMainSemiBold,
            letterSpacing: -1,
          },
        ]}
        underlineColorAndroid={'transparent'}
        placeholder={'SEARCH'}
        placeholderTextColor={st.colors.normalText}
        value={searchText}
        autoCapitalize={'characters'}
        onChangeText={text => setSearchText(text)}
        autoFocus={true}
        keyboardAppearance={'dark'}
        returnKeyType={'search'}
        autoCorrect={true}
        onSubmitEditing={() => {}}
      />
      <Icon
        name="search"
        style={[st.asc, st.mt4, { width: 20, height: 20 }]}
        onPress={() => {}}
      />
    </>
  );
}

export default SearchBox;
