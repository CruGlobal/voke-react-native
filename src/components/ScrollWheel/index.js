import React, { useState } from 'react';
import { Picker, View } from 'react-native';
import Image from '../Image';
import Touchable from '../Touchable';
import st from '../../st';
import SCROLL_WHEEL_BUTTON from '../../assets/scrollWheelButton.png';
import SCROLL_WHEEL_LINE from '../../assets/scrollWheelLine.png';

function ScrollWheel({ source, style, badge, onPress, ...rest }) {
  const [pickerItems, setPickerItems] = useState([
    'worship',
    'live',
    'fresh',
    'living room',
    'raw',
  ]);
  const [selectedItem, setSelectedItem] = useState(pickerItems[0]);
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
        itemStyle={[
          st.normalText,
          st.fs2,
          { fontFamily: st.fontFamilyMainSemiBold },
        ]}
      >
        {pickerItems.map((value, i) => (
          <Picker.Item label={value.toUpperCase()} value={value} key={value} />
        ))}
      </Picker>
      <View
        style={[st.abs, st.asc, { width: st.fullWidth }]}
        pointerEvents="none"
      >
        <Image
          source={SCROLL_WHEEL_LINE}
          style={[
            st.ase,
            { height: st.fullWidth * 0.17, width: st.fullWidth * 0.8 },
          ]}
        />
      </View>
      <Touchable
        style={[st.abs, st.ase, { width: st.fullWidth * 0.17 }]}
        onPress={async () => {
          // if (
          //   this.props.libraryTags.indexOf(
          //     this.state.dataSource[this.state.selectedItem],
          //   ) == -1
          // ) {
          //   var tags = this.props.libraryTags.concat(
          //     this.state.dataSource[this.state.selectedItem].text,
          //   );
          //   this.props.filterLibrary(tags);
          //   this.props.setScrollModal('Closed');
          // } else {
          //   this.props.setScrollModal('Closed');
          // }
        }}
      >
        <Image
          source={SCROLL_WHEEL_BUTTON}
          style={[
            st.ase,
            {
              height: st.fullWidth * 0.17,
              width: st.fullWidth * 0.17,
              right: 0,
            },
          ]}
        />
      </Touchable>
    </>
  );
}

export default ScrollWheel;
