import Chevron from 'domain/Common/Select/Chevron';

import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Touchable from 'components/Touchable';
import Text from 'components/Text';

import styles from './styles';

interface Option {
  label: string;
  value?: string | number;
  selected?: boolean;
}

interface Props {
  isOpen: boolean; // State managed outside of the component.
  onOpen: () => void;
  onClose: () => void;

  // Toggle/Button options:
  toggleTestId?: string;
  toggleText: string;
  toggleTextStyle?: TextStyle;

  // Selectable options:
  options: Option[]; // Array of options for dropdown.
  optionEl: (option: Option, key: number) => Element; // Custom render template for option elem.
  onSelect: (option: Option, key: number) => void;
}

const Select = (props: Props): ReactElement => {
  const {
    isOpen,
    options,
    onOpen,
    onClose,
    onSelect,
    toggleText,
    toggleTextStyle,
    optionEl,
    toggleTestId,
  } = props;
  // Refs needed for accessing measureInWindow().
  const toggleRef = useRef<TouchableOpacity | null>(null);
  const menuContainerRef: RefObject<View> = useRef(null);
  // Toggle position.
  const [toggleLeft, setToggleLeft] = useState(0);
  const [toggleWidth, setToggleWidth] = useState(0);
  // Dropdown position.
  const [menuTop, setMenuTop] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);
  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    setMenuLeft(toggleLeft + toggleWidth - menuWidth);
  }, [menuWidth, toggleLeft, toggleWidth]);

  const show = (): void => {
    // Get position of the toggle to calculate position for the dropdown.
    toggleRef.current?.measureInWindow((x, y, width, height) => {
      setToggleLeft(x);
      setToggleWidth(width);
      setMenuTop(y + height);
    });
    // Evoke event in the parent component.
    onOpen();
  };

  const hide = (): void => {
    onClose();
  };

  return (
    <View collapsable={false}>
      <TouchableOpacity
        ref={(newRef) => (toggleRef.current = newRef)}
        onPress={(): void => {
          show();
        }}
        style={styles.toggle}
        testID={toggleTestId}
      >
        <Text style={toggleTextStyle}>{toggleText}</Text>
        <Chevron color="white" style={{ marginLeft: 10, marginRight: 2 }} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        onRequestClose={hide}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        transparent
      >
        <TouchableWithoutFeedback
          onPress={hide}
          accessible={false}
          testID="dropdownBackdrop"
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                // Don't show menu until menuWidth calculated.
                opacity: menuWidth === 0 ? 0 : 1,
              },
            ]}
          >
            <View
              ref={menuContainerRef}
              onLayout={(): void => {
                menuContainerRef.current?.measureInWindow((x, y, width) => {
                  setMenuWidth(width);
                });
              }}
              style={[
                styles.dropdown,
                {
                  left: menuLeft,
                  top: menuTop,
                },
              ]}
            >
              {options.map((option, key) => {
                return (
                  <Touchable
                    onPress={(): void => {
                      onSelect(option, key);
                      hide();
                    }}
                    style={[
                      styles.option,
                      {
                        backgroundColor: option?.selected
                          ? 'rgba(0,0,0,.07)'
                          : 'transparent',
                      },
                    ]}
                    key={key}
                  >
                    {optionEl(option, key)}
                  </Touchable>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Select;
