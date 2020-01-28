import React from 'react';
import st from '../../st';
import MultiSelect from 'react-native-multiple-select';
import { isArray } from '../../utils/common';

const Select = ({
  isMulti,
  selectedValue,
  onChange,
  onUpdate,
  options,
  placeholder,
  containerColor,
  isDisabled,
  label,
  ...rest
}) => {
  function handleChange(selectedItems) {
    const selectedOptions = selectedItems.map(
      s => options.find(so => so.value === s) || { value: s },
    );
    const changeVal = isMulti ? selectedOptions : selectedOptions[0];
    onChange && onChange(changeVal);
    onUpdate && onUpdate(changeVal);
  }
  // TODO: Do disabled state

  const arrOfSelected = !selectedValue
    ? []
    : !isMulti && !isArray(selectedValue)
    ? [selectedValue]
    : selectedValue;
  const selectedLabels = arrOfSelected
    .map(s => options.find(so => so.value === s) || { label: s })
    .map(s => s.label);
  return (
    <MultiSelect
      single={!isMulti}
      hideTags={true}
      items={options}
      uniqueKey="value"
      displayKey="label"
      onSelectedItemsChange={handleChange}
      selectedItems={arrOfSelected}
      selectText={placeholder}
      searchInputPlaceholderText={placeholder || 'Search Items...'}
      onChangeInput={text => console.log(text)}
      textInputProps={{ style: [st.pv4, st.w80], autoFocus: false }}
      tagRemoveIconColor={st.colors.black}
      tagBorderColor={st.colors.black}
      tagTextColor={st.colors.black}
      selectedItemTextColor={st.colors.white}
      selectedItemIconColor={st.colors.white}
      itemTextColor={st.colors.white}
      submitButtonColor={st.colors.black}
      submitButtonText="Done Selecting Items"
      // hideDropdown
      styleItemsContainer={[
        { backgroundColor: containerColor || st.colors.white },
      ]}
      // styleInputGroup={[st.pr3]}
      styleSelectorContainer={[st.brbr6, st.brbl6, st.ovh, { marginTop: -5 }]}
      styleListContainer={[]}
      styleRowList={[st.bw1, st.ph4, st.pv5, st.borderTransparent, st.bbBlue]}
      // styleMainWrapper={[st.pr4]}
      // styleDropdownMenu={[st.pr4]}
      styleDropdownMenuSubsection={[st.brbr6, st.brbl6, st.h(50)]}
      styleTextDropdownSelected={[st.pl4, st.tal]}
      styleTextDropdown={[st.pl4, st.pr1]}
      // searchInputStyle={{ flex: 1 }}
    />
  );
};

export default Select;
