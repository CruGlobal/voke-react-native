import React, { useState, useEffect } from 'react';
import { Picker, View } from 'react-native';
import Image from '../Image';
import Touchable from '../Touchable';
import st from '../../st';
import SCROLL_WHEEL_BUTTON from '../../assets/scrollWheelButton.png';
import SCROLL_WHEEL_LINE from '../../assets/scrollWheelLine.png';

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
        style={[
          st.asc,
          st.abs,
          {
            height: !st.isAndroid ? null : '100%',
            width: st.fullWidth,
            left: !st.isAndroid ? st.fullWidth * 0.04 : st.fullWidth * 0.09,
          },
        ]}
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
        style={[st.abs, st.asc, { width: st.fullWidth }]}
        pointerEvents="none"
      >
        <Image
          source={SCROLL_WHEEL_LINE}
          resizeMode="contain"
          style={[
            st.ase,
            { height: st.fullWidth * 0.17, width: st.fullWidth * 0.8 },
          ]}
        />
      </View>
      <Touchable
        style={[st.abs, st.ase, { width: st.fullWidth * 0.17 }]}
        onPress={async () => {
          onSelect(selectedItem);
        }}
      >
        <Image
          source={SCROLL_WHEEL_BUTTON}
          resizeMode="contain"
          style={[
            st.ase,
            {
              height: 30,
              width: 30,
              right: 20,
            },
          ]}
        />
      </Touchable>
    </>
  );
}

export default ScrollWheel;
