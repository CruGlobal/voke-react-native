import React, { useState, useEffect } from 'react';
import { Picker, View } from 'react-native';
import SCROLL_WHEEL_BUTTON from 'src/assets/scrollWheelButton.png';
import SCROLL_WHEEL_LINE from 'src/assets/scrollWheelLine.png';
import st from 'utils/st';

import Image from '../Image';
import Touchable from '../Touchable';

function ScrollWheel({ items, onSelect, ...rest }) {
  const [pickerItems, setPickerItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState(pickerItems[0]);

  useEffect(() => {
    setPickerItems(items);
  }, [items]);

  console.log(pickerItems);

  return (
    <>
      <Picker
        selectedValue={selectedItem}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          height: !st.isAndroid ? null : '100%',
          width: st.fullWidth,
          left: !st.isAndroid ? st.fullWidth * 0.04 : st.fullWidth * 0.09,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
        itemStyle={[st.white, st.fs2]}
      >
        {(pickerItems || []).map((value, i) => (
          <Picker.Item
            label={(value.name || '').toUpperCase()}
            value={value.id}
            key={value.name}
          />
        ))}
      </Picker>
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          width: st.fullWidth,
        }}
        pointerEvents="none"
      >
        <Image
          source={SCROLL_WHEEL_LINE}
          resizeMode="contain"
          style={{
            alignSelf: 'flex-end',
            height: st.fullWidth * 0.17,
            width: st.fullWidth * 0.8,
          }}
        />
      </View>
      <Touchable
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          width: st.fullWidth * 0.17,
        }}
        onPress={async () => {
          onSelect(selectedItem);
        }}
      >
        <Image
          source={SCROLL_WHEEL_BUTTON}
          resizeMode="contain"
          style={{
            alignSelf: 'flex-end',
            height: 30,
            width: 30,
            right: 20,
          }}
        />
      </Touchable>
    </>
  );
}

export default ScrollWheel;
