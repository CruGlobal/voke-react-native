import React, { useState } from 'react';
import st from 'utils/st';
import { TextInput } from 'react-native';

import VokeIcon from '../VokeIcon';

function SearchBox() {
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
        onChangeText={(text) => setSearchText(text)}
        autoFocus={true}
        keyboardAppearance={'dark'}
        returnKeyType={'search'}
        autoCorrect={true}
        onSubmitEditing={() => {}}
      />
      <VokeIcon
        name="search"
        style={[st.asc, st.mt4, { width: 20, height: 20 }]}
        onPress={() => {}}
      />
    </>
  );
}

export default SearchBox;
